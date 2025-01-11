var jpdbBaseUrl = "http://api.login2explore.com:5577/";
var connToken = "90934453|-31949228894225359|90956963"
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var empDBName = "EMP-DBNew";
var empRelationName = "EmpData";

setBaseUrl(jpdbBaseUrl);

function disableCtrl(ctrl) {
    $("#new").prop("disabled", ctrl);
    $("#save").prop("disabled", ctrl);
    $("#edit").prop("disabled", ctrl);
    $("#change").prop("disabled", ctrl);
    $("#reset").prop("disabled", ctrl);
}
function disableNav(ctrl) {
    $("#first").prop("disabled", ctrl);
    $("#prev").prop("disabled", ctrl);
    $("#next").prop("disabled", ctrl);
    $("#last").prop("disabled", ctrl);
}
function disableForm(bValue) {
    $("#empid").prop("disabled", bValue);
    $("#empname").prop("disabled", bValue);
    $("#empsal").prop("disabled", bValue);
    $("#hra").prop("disabled", bValue);
    $("#da").prop("disabled", bValue);
    $("#deduct").prop("disabled", bValue);
}
function initEmpForm() {
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("last_rec_no");
    localStorage.removeItem("rec_no");
    
    console.log("initEmpForm() - done");
//  alert("initEmpForm() - done");
}
function setFirstRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined) {
        localStorage.setItem("first_rec_no", "O");
    }
    else {
        localStorage.setItem("first_rec_no", data.rec_no);
    }
}
function getFirstRecNoFromLS() {
    return localStorage.getItem("first_rec_no");
}
function setLastRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    if(data.rec_no === undefined) {
        localStorage.setItem("last_rec_no", "O"); //check for O
    }
    else {
        localStorage.setItem("last_rec_no", data.rec_no);
    }
}

function setCurrRecNo2LS(jsonObj) {
    var data = JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", data.rec_no);
}
function getCurrRecNoFromLS() {
    return localStorage.getItem("rec_no");
}

$("#empid").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empid = $("#empid").val();
    var jsonStr = {
        id: empid
    };
    return JSON.stringify(jsonStr);
}

function getEmp() {
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empDBName, empRelationName, empIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empname").focus();
    }
    else if (resJsonObj.status === 200) {
        $("#empid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#empname").focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#empname").val(data.name);
    $("#empsal").val(data.salary);
    $("#hra").val(data.hra);
    $("#da").val(data.da);
    $("#deduct").val(data.deduction);
}

function resetForm() {
    $("#empid").val("");
    $("#empname").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
    $("#empid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#empid").focus();
}
function newForm() {
    makeDataFormEmpty();
    disableForm(false);
    $("#empid").focus();
    disableNav(true);
    disableCtrl(true);
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
}
function makeDataFormEmpty() {
    $("#empid").val("");
    $("#empname").val("");
    $("#empsal").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduct").val("");
}

function validateData() {
    var empid, empname, empsal, hra, da, deduct;
    empid = $("#empid").val();
    empname = $("#empname").val();
    empsal = $("#empsal").val();
    hra = $("#hra").val();
    da = $("#da").val();
    deduct = $("#deduct").val();

    if(empid === "") {
        alert("Employee ID missing");
        $("#empid").focus();
        return "";
    }
    if(empname === "") {
        alert("Employee Name missing");
        $("#empname").focus();
        return "";
    }
    if(empsal === "") {
        alert("Employee Salary missing");
        $("#empsal").focus();
        return "";
    }
    if(hra === "") {
        alert("HRA missing");
        $("#hra").focus();
        return "";
    }
    if(da === "") {
        alert("DA missing");
        $("#da").focus();
        return "";
    }
    if(deduct === "") {
        alert("Deduction missing");
        $("#deduct").focus();
        return "";
    }
    var jsonStrObj = {
        id: empid,
        name: empname,
        salary: empsal,
        hra: hra,
        da: da,
        deduction: deduct
    };
    return JSON.stringify(jsonStrObj);
}
function getFirst() {
    var getFirstRequest=createFIRST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getFirstRequest, irlPartUrl);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async: true});
    $("#empid").prop("disabled", true);
    $("#first").prop("disabled", true);
    $("#prev").prop("disabled", true);
    $("#next").prop("disabled", false);
    $("#save").prop("disabled", true);
}
function getNext() {
    var r = getCurrRecNoFromLS();
    var getPrevRequest=createNEXT_RECORDRequest(connToken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result=executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $("#save").prop("disabled", true);
}
function getLast() {
    var getLastRequest=createLAST_RECORDRequest(connToken, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getLastRequest, irlPartUrl);
    setLastRecNo2LS(result);
    showData(result);
    jQuery.ajaxSetup({async: true});
    $("#first").prop("disabled", false);
    $("#prev").prop("disabled", false);
    $("#last").prop("disabled", false);
    $("#next").prop("disabled", true);
    $("#save").prop("disabled", true);
}
function getPrev() {
    var r = getCurrRecNoFromLS();
    if(r===1) {
        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
    }
    var getPrevRequest = createPREV_RECORDRequest(connToken, empDBName, empRelationName, r);
    jQuery.ajaxSetup({async: false});
    var result = executeCommand(getPrevRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r = getCurrRecNoFromLS();
    if(r === 1) {
        $("#first").prop("disabled", true);
        $("#prev").prop("disabled", true);
    }
    $("#save").prop("disabled", true);
}
function saveData() {
    var jsonStrObj = validateData();
    if(jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empDBName, empRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    if(isNoRecordPresentLS()) {
        setFirstRecNo2LS(jsonObj);
    }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    resetForm();
}
function editData() {
    disableForm(false);
    $("#empid").prop("disabled", true);
    $("#empname").focus();
    disableNav(true);
    disableCtrl(true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
}

function showData(jsonObj) {
    if(jsonObj.status === 400) {
        return;
    }
    var data = (JSON.parse(jsonObj.data)).record;
    setCurrRecNo2LS(jsonObj);
    $("#empid").val(data.id);
    $("#empname").val(data.name);
    $("#empsal").val(data.salary);
    $("#hra").val(data.hra);
    $("#da").val(data.da);
    $("#deduct").val(data.deduction);
    disableNav(false);
    disableForm(true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#new").prop("disabled", false);
    $("#edit").prop("disabled", false);
    if(getCurrRecNoFromLS() === getLastRecNoFromLS()) {
        $("#next").prop("disabled", true);
        $("#last").prop("disabled", true);
    }
    if(getCurrRecNoFromLS() === getLastRecNoFromLS()) {
        $("#prev").prop("disabled", true);
        $("#first").prop("disabled", true);
        return;
    }
}
function isOnlyOneRecordPresent() {
    if(isNoRecordPresentLS()) {
        return false;
    }
    if(getFirstRecNoFromLS() === getLastRecNoFromLS()) {
        return true;
    }
    return false;
}
function checkForNoOrOneRecord() {
    if(isNoRecordPresentLS()) {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $("#new").prop("disabled", false);
        return;
    }
    if(isOnlyOneRecordPresent()) {
        disableForm(true);
        disableNav(true);
        disableCtrl(true);
        $("#new").prop("disabled", false);
        $("#edit").prop("disabled", false);
        return;
    }
}
function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, empDBName, empRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#empid").focus();
    $("#edit").focus();
}
