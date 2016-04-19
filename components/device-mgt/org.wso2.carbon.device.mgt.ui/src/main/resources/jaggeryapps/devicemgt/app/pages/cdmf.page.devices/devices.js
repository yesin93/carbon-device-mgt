/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function onRequest(context) {
    var constants = require("/app/modules/constants.js");
    var userModule = require("/app/modules/user.js").userModule;
    var deviceModule = require("/app/modules/device.js").deviceModule;

    var groupName = request.getParameter("groupName");
    var groupOwner = request.getParameter("groupOwner");

    var page = {};
    var title = "Devices";
    if (groupName) {
        title = groupName + " " + title;
        page.groupName = groupName;
    }
    page.title = title;
    var currentUser = session.get(constants.USER_SESSION_KEY);
    if (currentUser) {
        page.permissions = {};
        page.permissions.list = stringify(userModule.getUIPermissions());
        if (userModule.isAuthorized("/permission/admin/device-mgt/admin/devices/add")) {
            permissions.enroll = true;
        }
        page.currentUser = currentUser;
        var deviceCount = 0;
        if (groupName && groupOwner) {
            var groupModule = require("/app/modules/group.js").groupModule;
            deviceCount = groupModule.getGroupDeviceCount(groupName, groupOwner);
            page.groupOwner = groupOwner;
        } else {
            deviceCount = deviceModule.getOwnDevicesCount();
        }
        if (deviceCount > 0) {
            page.deviceCount = deviceCount;
            var utility = require("/app/modules/utility.js").utility;
            var data = deviceModule.getDeviceTypes();
            var deviceTypes = [];
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    var deviceType = utility.getDeviceTypeConfig(data[i].name).deviceType;
                    deviceTypes.push({
                        "type": data[i].name,
                        "category": deviceType.category,
                        "label": deviceType.label
                    });
                }
            }
            page.deviceTypes = stringify(deviceTypes);
        }
    }
    return page;
}