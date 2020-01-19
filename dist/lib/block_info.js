"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generate_config_1 = require("../generate_config");
var fs = require("fs-extra");
var path = require("path");
var color_log_1 = require("../color_log");
var VersionList = [];
var GroupList = [];
var BlockInfoList = [];
var Define = {};
var config = generate_config_1.getConfig();
function getBlockInfo(tagInfoArray) {
    var info = {};
    for (var _i = 0, tagInfoArray_1 = tagInfoArray; _i < tagInfoArray_1.length; _i++) {
        var item = tagInfoArray_1[_i];
        var infoDetail = {};
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
        }
        else {
            info[item.name] = infoDetail;
        }
    }
    updateVersionAndGroup(info);
}
exports.getBlockInfo = getBlockInfo;
function updateVersionAndGroup(blockInfo) {
    var version = blockInfo.Version && blockInfo.Version.key ? blockInfo.Version.key : config.version;
    var group = blockInfo.Group && blockInfo.Group.key ? blockInfo.Group.key : '';
    var defineName = blockInfo.Define && blockInfo.Define.key ? blockInfo.Define.key : '';
    version && (VersionList.indexOf(version) < 0) && VersionList.push(version);
    group && (GroupList.indexOf(group) < 0) && GroupList.push(group);
    if (defineName) {
        delete blockInfo.Reuse;
        Define[defineName] = blockInfo;
    }
    else {
        BlockInfoList.push(blockInfo);
    }
}
var commonJson = {};
function writeJson() {
    commonJson.versionList = VersionList;
    commonJson.docTitle = config.title;
    commonJson.baseUrl = config.baseUrl;
    Object.assign(commonJson, Define);
    var outputPath = path.resolve(process.cwd(), config.output, 'data');
    fs.emptyDir(outputPath, function (err) {
        if (err) {
            color_log_1.errorLog(err.message);
            process.exit(1);
        }
        else {
            writeCommonJson(outputPath, commonJson);
            writeGroupJson(outputPath, BlockInfoList);
            copyTemplate(path.resolve(process.cwd(), config.output));
        }
    });
}
exports.writeJson = writeJson;
function copyTemplate(toDir) {
    var templatePath = path.resolve(__dirname, '../../template');
    fs.copy(templatePath, toDir, function (err) {
        if (err) {
            color_log_1.errorLog(err.message);
            process.exit(1);
        }
    });
}
function writeCommonJson(outputPath, commonJson) {
    var writeFile = path.resolve(outputPath, './common.json');
    doWriteJsonFile(writeFile, commonJson);
}
function getVersion(block) {
    if (block.Version) {
        return block.Version.key;
    }
    else if (block.Reuse) {
        var reuseKey = block.Reuse.key;
        return Define[reuseKey] ? (Define[reuseKey].Version ? Define[reuseKey].Version.key : config.version) : config.version;
    }
    else {
        return config.version;
    }
}
function getGroup(block) {
    if (block.Group) {
        return block.Group.key;
    }
    else if (block.Reuse) {
        var reuseKey = block.Reuse.key;
        if (Define[reuseKey] && Define[reuseKey].Group && Define[reuseKey].Group.key) {
            return Define[reuseKey].Group.key;
        }
        else {
            return 'default';
        }
    }
    else {
        return 'default';
    }
}
function mergeReuseKey(blockJson) {
    for (var key in blockJson) {
        if (blockJson[key].Reuse && blockJson[key].Reuse.key) {
            var reuseKey = blockJson[key].Reuse.key;
            var defineObject = Define[reuseKey];
            if (defineObject) {
                for (var defineKey in defineObject) {
                    !blockJson[key][defineKey] && defineKey !== 'Define' && defineObject[defineKey] && (blockJson[key][defineKey] = defineObject[defineKey]);
                }
            }
        }
    }
    return blockJson;
}
function writeGroupJson(outputPath, BlockInfoList) {
    var versionObj = {};
    for (var _i = 0, BlockInfoList_1 = BlockInfoList; _i < BlockInfoList_1.length; _i++) {
        var block = BlockInfoList_1[_i];
        var version = getVersion(block);
        versionObj[version] = versionObj[version] || {};
        var blockJson = versionObj[version];
        var name_1 = block.Name.key;
        var group = getGroup(block);
        blockJson[group] = blockJson[group] || {};
        blockJson[group][name_1] = block;
    }
    for (var version in versionObj) {
        var blockJson = versionObj[version];
        var groupList = [];
        for (var key in blockJson) {
            groupList.push(key);
            var groupFileName = key + '.json';
            var writeFile = path.resolve(outputPath, version, groupFileName);
            doWriteJsonFile(writeFile, mergeReuseKey(blockJson[key]));
        }
        groupList = groupList.sort();
        var defaultIndex = groupList.indexOf('default');
        if (defaultIndex >= 0) {
            groupList.splice(defaultIndex, 1);
            groupList.splice(0, 0, 'default');
        }
        var groupInfo = path.resolve(outputPath, version, 'groupInfo.json');
        doWriteJsonFile(groupInfo, { group: groupList });
    }
}
var totalOutPutFile = 0;
function doWriteJsonFile(pathStr, fileObject) {
    totalOutPutFile += 1;
    fs.outputJSON(pathStr, fileObject, { spaces: 2 }, function (err) {
        if (err) {
            color_log_1.errorLog(err.message);
            process.exit(1);
        }
        totalOutPutFile -= 1;
        if (totalOutPutFile <= 0) {
            var useTime = Math.floor(new Date().getTime() / 1000) - config._startTime || 0;
            color_log_1.successLog("complete all the files, use time: " + useTime + " seconds");
            var outputPath = path.resolve(process.cwd(), config.output);
            color_log_1.successLog("write static files in \"" + outputPath + "\"");
            color_log_1.infoLog('you can use "easyApi -s -o [public path]" to start a static server');
        }
    });
}
