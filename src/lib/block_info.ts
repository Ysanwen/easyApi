import TagInfo from './parse_tool/tag_info'
import { getConfig, ConfigObject } from '../generate_config';
import * as fs from "fs-extra";
import * as path from "path";
import { errorLog, infoLog, successLog } from '../color_log';


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
    item.isRequired !== undefined && item.isRequired !== null && (infoDetail.isRequired = item.isRequired);
    item.responseType && (infoDetail.responseType = item.responseType);
    item.responseCode && (infoDetail.responseCode = item.responseCode);
    if (item.name === 'HeaderParam'
      || item.name === 'UrlParam'
      || item.name === 'QueryParam'
      || item.name === 'BodyParam'
      || item.name === 'SuccessResponse'
      || item.name === 'ErrorResponse') {
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
  // commonJson.groupList = GroupList;
  commonJson.docTitle = config.title;
  commonJson.baseUrl = config.baseUrl;
  Object.assign(commonJson, Define);
  let outputPath = path.resolve(process.cwd(), config.output, 'data');
  fs.emptyDir(outputPath, (err: Error) => {
    if (err) {
      errorLog(err.message);
      process.exit(1);
    } else {
      writeCommonJson(outputPath, commonJson);
      writeGroupJson(outputPath, BlockInfoList);
      copyTemplate(path.resolve(process.cwd(), config.output));
    }
  })
}

function copyTemplate (toDir: string): void {
  let templatePath = path.resolve(__dirname, '../../template');
  fs.copy(templatePath, toDir, (err:Error) => {
    if (err) {
      errorLog(err.message);
      process.exit(1);
    }
  })
}

function writeCommonJson (outputPath: string, commonJson: any): void {
  let writeFile = path.resolve(outputPath, './common.json');
  doWriteJsonFile(writeFile, commonJson);
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

function getGroup (block:any):string {
  if (block.Group) {
    return block.Group.key;
  } else if (block.Reuse) {
    let reuseKey = block.Reuse.key;
    if (Define[reuseKey] && Define[reuseKey].Group && Define[reuseKey].Group.key) {
      return Define[reuseKey].Group.key
    } else {
      return 'default';
    }
  } else {
    return 'default';
  }
}

function mergeReuseKey (blockJson: any): any {
  for (let key in blockJson) {
    if (blockJson[key].Reuse && blockJson[key].Reuse.key) {
      let reuseKey = blockJson[key].Reuse.key;
      let defineObject = Define[reuseKey];
      if (defineObject) {
        for (let defineKey in defineObject) {
          !blockJson[key][defineKey] && defineKey !== 'Define' && defineObject[defineKey] && (blockJson[key][defineKey] = defineObject[defineKey]);
        }
      }
    }
  }
  return blockJson;
}

function writeGroupJson (outputPath:string, BlockInfoList: any):void {
  let versionObj:any = {};
  for (let block of BlockInfoList) {
    let version = getVersion(block);
    versionObj[version] = versionObj[version] || {};
    let blockJson:any = versionObj[version];
    let name = block.Name.key;
    let group = getGroup(block);
    blockJson[group] = blockJson[group] || {};
    blockJson[group][name] = block;
  }
  for (let version in versionObj) {
    let blockJson = versionObj[version];
    let groupList: string[] = [];
    for (let key in blockJson) {
      groupList.push(key);
      let groupFileName = key + '.json';
      let writeFile = path.resolve(outputPath, version, groupFileName);
      doWriteJsonFile(writeFile, mergeReuseKey(blockJson[key]));
    }
    groupList = groupList.sort();
    let defaultIndex = groupList.indexOf('default');
    if (defaultIndex >= 0) {
      groupList.splice(defaultIndex, 1);
      groupList.splice(0, 0, 'default');
    }
    let groupInfo = path.resolve(outputPath, version, 'groupInfo.json');
    doWriteJsonFile(groupInfo, {group: groupList});
  }
}

let totalOutPutFile = 0;
function doWriteJsonFile(pathStr: string, fileObject: any): void {
  totalOutPutFile += 1;
  fs.outputJSON(pathStr, fileObject, {spaces: 2}, (err:Error) => {
    if (err) {
      errorLog(err.message);
      process.exit(1);
    }
    totalOutPutFile -= 1;
    if (totalOutPutFile <= 0) {
      let useTime = Math.floor(new Date().getTime() / 1000) - config._startTime || 0;
      successLog(`complete all the files, use time: ${useTime} seconds`);
      let outputPath =  path.resolve(process.cwd(), config.output);
      successLog(`write static files in "${outputPath}"`);
      infoLog('you can use "easyApi -s -o [public path]" to start a static server');
    }
  })
}