Endpoint: POST /admin-api/hnaircode/audio-marking-type/create
Summary: 创建录音打标类型数据保存
Parameters: [
{
"name": "tenant-id",
"in": "header",
"type": "integer",
"description": "租户编号"
},
{
"name": "Authorization",
"in": "header",
"type": "string",
"description": "认证 Token"
}
]
RequestBody: {
"id": "integer",
"callId": "string",
"agentId": "string",
"markingDimension": "string",
"markingOneType": "string",
"markingTwoType": "string"
}


---

Endpoint: POST /admin-api/hnaircode/audio-marking-type-statement/create
Summary: 创建录音打标类型数据明细
Parameters: [
{
"name": "tenant-id",
"in": "header",
"type": "integer",
"description": "租户编号"
},
{
"name": "Authorization",
"in": "header",
"type": "string",
"description": "认证 Token"
}
]
RequestBody: {
"id": "integer",
"markingTypeId": "integer",
"callId": "string",
"agentId": "string",
"markingDimensionAgo": "string",
"markingOneTypeAgo": "string",
"markingTwoTypeAgo": "string",
"operationType": "string",
"version": "integer",
"markingDimension": "string",
"markingOneType": "string",
"markingTwoType": "string",
"operationPersonId": "string",
"operationPersonName": "string",
"operationTime": "string"
}


---

Endpoint: POST /admin-api/hnaircode/audio-dialogue/create
Summary: 创建录音文本对话详情
Parameters: [
{
"name": "tenant-id",
"in": "header",
"type": "integer",
"description": "租户编号"
},
{
"name": "Authorization",
"in": "header",
"type": "string",
"description": "认证 Token"
}
]
RequestBody: {
"id": "integer",
"audioTextId": "integer",
"speakerName": "string",
"speaker": "string",
"startTime": "integer",
"endTime": "integer",
"text": "string"
}


---

Endpoint: POST /admin-api/hnaircode/audio-deduction-item/create
Summary: 创建质检录音扣分记录
Parameters: [
{
"name": "tenant-id",
"in": "header",
"type": "integer",
"description": "租户编号"
},
{
"name": "Authorization",
"in": "header",
"type": "string",
"description": "认证 Token"
}
]
RequestBody: {
"id": "integer",
"callId": "string",
"recordingId": "integer",
"totalPenaltyPoints": "integer",
"processedTime": "string",
"processId": "integer",
"processStatus": "string",
"audioStartTime": "string",
"evaluatedEmployeeSamaccountname": "string",
"evaluatedEmployeeAgentId": "string",
"evaluatedEmployeeName": "string",
"scoreTime": "string",
"endTime": "string",
"qualityCheckType": "boolean",
"appealRemark": "string",
"qualityCheckRemark": "string",
"qualityCheckPersonId": "string",
"qualityCheckPersonName": "string",
"qualityCheckSamaccountname": "string",
"deductionFlagStatus": "boolean"
}


---

Endpoint: POST /admin-api/hnaircode/audio-deduction-item-his/create
Summary: 创建质检录音扣分记录
Parameters: [
{
"name": "tenant-id",
"in": "header",
"type": "integer",
"description": "租户编号"
},
{
"name": "Authorization",
"in": "header",
"type": "string",
"description": "认证 Token"
}
]
RequestBody: {
"id": "integer",
"audioDeductionId": "integer",
"callId": "string",
"recordingId": "integer",
"totalPenaltyPoints": "integer",
"processedTime": "string",
"processId": "integer",
"processStatus": "string",
"audioStartTime": "string",
"evaluatedEmployeeSamaccountname": "string",
"evaluatedEmployeeAgentId": "string",
"evaluatedEmployeeName": "string",
"endTime": "string",
"scoreTime": "string",
"qualityCheckType": "boolean",
"appealRemark": "string",
"qualityCheckRemark": "string",
"qualityCheckPersonId": "string",
"qualityCheckPersonName": "string",
"qualityCheckSamaccountname": "string",
"version": "integer",
"deductionFlagStatus": "boolean"
}
