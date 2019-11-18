import TagInfo from './parse_tool/tag_info'
// import { getConfig, ConfigObject } from '../generate_config';


const VersionList: string[] = [];
const GroupList: string[] = [];
const BlogInfoList: any = [];
const Define: any = {};


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
  let version = blockInfo.Version && blockInfo.Version.key ? blockInfo.Version.key : '';
  let group = blockInfo.Group && blockInfo.Group.key ? blockInfo.Group.key : '';
  let defineName = blockInfo.Define && blockInfo.Define.key ? blockInfo.Define.key : '';
  version && (VersionList.indexOf(version) < 0) && VersionList.push(version);
  group && (GroupList.indexOf(group) < 0) && GroupList.push(group);
  if (defineName) {
    Define[defineName] = blockInfo;
  } else {
    BlogInfoList.push(blockInfo);
  }
}

export function writeJson (): void {
  console.log(VersionList);
  console.log(GroupList);
  console.log(BlogInfoList);
  console.log(Define);
}