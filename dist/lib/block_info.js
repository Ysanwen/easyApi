"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var generate_config_1 = require("../generate_config");
var fs = require("fs-extra");
var path = require("path");
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
    Object.assign(commonJson, Define);
    var outputPath = path.resolve(process.cwd(), config.output, 'data');
    fs.emptyDir(outputPath, function (err) {
        if (err) {
            console.log(err);
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
            console.log(err);
            process.exit(1);
        }
    });
}
function writeCommonJson(outputPath, commonJson) {
    var writeFile = path.resolve(outputPath, './common.json');
    fs.outputJSON(writeFile, commonJson, { spaces: 2 }, function (err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });
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
function writeGroupJson(outputPath, BlockInfoList) {
    var versionObj = {};
    for (var _i = 0, BlockInfoList_1 = BlockInfoList; _i < BlockInfoList_1.length; _i++) {
        var block = BlockInfoList_1[_i];
        var version = getVersion(block);
        versionObj[version] = versionObj[version] || {};
        var blockJson = versionObj[version];
        var name_1 = block.Name.key;
        var group = block.Group ? block.Group.key || 'default' : 'default';
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
            fs.outputJSON(writeFile, blockJson[key], { spaces: 2 }, function (err) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
            });
        }
        groupList = groupList.sort();
        var defaultIndex = groupList.indexOf('default');
        if (defaultIndex >= 0) {
            groupList.splice(defaultIndex, 1);
            groupList.splice(0, 0, 'default');
        }
        var groupInfo = path.resolve(outputPath, version, 'groupInfo.json');
        fs.outputJSON(groupInfo, { group: groupList }, { spaces: 2 }, function (err) {
            if (err) {
                console.log(err);
                process.exit(1);
            }
        });
    }
}
