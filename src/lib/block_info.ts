import TagInfo from './parse_tool/tag_info'
import { getConfig, ConfigObject } from '../generate_config';
import * as fs from "fs-extra";
import * as path from "path";


const VersionList: string[] = [];
const GroupList: string[] = [];
const BlockInfoList: any = [];
const Define: any = {};

let config: ConfigObject = getConfig();


export function getBlockInfo (tagInfoArray: TagInfo[]) {
  let info = {};
  for (let item of tagInfoArray) {
    let infoDetail: any = {};
    item.method && (infoDetail.method = item.method);
    item.path && (infoDetail.path = item.path);
    item.key && (infoDetail.key = item.key);
    item.description && (infoDetail.description = item.description);
    item.replaceWith && (infoDetail.replaceWith = item.replaceWith);
    item.valueType && (infoDetail.valueType = item.valueType);
    if (item.name === 'HeaderParam'
      || item.name === 'UrlParam'
      || item.name === 'QueryParam'
      || item.name === 'BodyParam') {
      info[item.name] = info[item.name] || [];
      info[item.name].push(infoDetail);
    } else {
      info[item.name] = infoDetail;
    }
  }
  updateVersionAndGroup(info);
}

function updateVersionAndGroup (blockInfo: any) {
  let version = blockInfo.Version && blockInfo.Version.key ? blockInfo.Version.key : config.version;
  let group = blockInfo.Group && blockInfo.Group.key ? blockInfo.Group.key : '';
  let defineName = blockInfo.Define && blockInfo.Define.key ? blockInfo.Define.key : '';
  version && (VersionList.indexOf(version) < 0) && VersionList.push(version);
  group && (GroupList.indexOf(group) < 0) && GroupList.push(group);
  if (defineName) {
    delete blockInfo.Reuse;
    Define[defineName] = blockInfo;
  } else {
    BlockInfoList.push(blockInfo);
  }
}

const commonJson:any = {};

export function writeJson (): void {
  commonJson.versionList = VersionList;
  commonJson.groupList = GroupList;
  Object.assign(commonJson, Define);
  let outputPath = path.resolve(process.cwd(), config.output);
  fs.emptyDir(outputPath, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      writeCommonJson(outputPath, commonJson);
      writeGroupJson(outputPath, BlockInfoList);
    }
  })
}

function writeCommonJson (outputPath: string, commonJson: any): void {
  let writeFile = path.resolve(outputPath, './common.json');
  fs.outputJSON(writeFile, commonJson, {spaces: 2}, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  })
}

function getVersion (block: any): string {
  if (block.Version) {
    return block.Version.key;
  } else if (block.Reuse) {
    let reuseKey = block.Reuse.key;
    return Define[reuseKey] ? (Define[reuseKey].Version ? Define[reuseKey].Version.key : config.version) : config.version;
  } else {
    return config.version;
  }
}

function writeGroupJson (outputPath:string, BlockInfoList: any):void {
  let versionObj:any = {};
  for (let block of BlockInfoList) {
    let version = getVersion(block);
    versionObj[version] = versionObj[version] || {};
    let blockJson:any = versionObj[version];
    let name = block.Name.key;
    let group = block.Group ? block.Group.key || 'default' : 'default';
    blockJson[group] = blockJson[group] || {};
    blockJson[group][name] = block;
  }
  for (let version in versionObj) {
    let blockJson = versionObj[version];
    for (let key in blockJson) {
      let groupFileName = key + '.json';
      let writeFile = path.resolve(outputPath, version, groupFileName);
      fs.outputJSON(writeFile, blockJson[key], {spaces: 2}, (err) => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
      })
    }
  }
}