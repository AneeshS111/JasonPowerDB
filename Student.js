var jpdbBaseUrl = "http://api.login2explore.com:5577/";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "STUDENT_DB";
var stuRelationName = "STUDENT_TABLE";
var connToken = "90934453|-31949228894225359|90956963"

$("#rollno").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStuIdAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}

function getStu() {
    var rollNoJsonObj = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, rollNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }
    else if (resJsonObj.status === 200) {
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#rollno").focus();
    }
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#fullname").val(data.name);
    $("#class").val(data.class);
    $("#birthdate").val(data.birthdate);
    $("#address").val(data.address);
    $("#enrollmentdate").val(data.enrollmentdate);
}

function resetForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

function validateData() {
    var rollno, fullname, Class, birthdate, address, enrollmentdate;
    rollno = $("#rollno").val();
    fullname = $("#fullname").val();
    Class = $("#class").val();
    birthdate = $("#birthdate").val();
    address = $("#address").val();
    enrollmentdate = $("#enrollmentdate").val();

    if(rollno === "") {
        alert("Roll No missing");
        $("#rollno").focus();
        return "";
    }
    if(fullname === "") {
        alert("Student Name missing");
        $("#fullname").focus();
        return "";
    }
    if(Class === "") {
        alert("Class missing");
        $("#class").focus();
        return "";
    }
    if(birthdate === "") {
        alert("Birth Date missing");
        $("#birthdate").focus();
        return "";
    }
    if(address === "") {
        alert("Address missing");
        $("#address").focus();
        return "";
    }
    if(enrollmentdate === "") {
        alert("Enrollment Date missing");
        $("#enrollmentdate").focus();
        return "";
    }
    var jsonStrObj = {
        id: rollno,
        name: fullname,
        class: Class,
        birthdate: birthdate,
        address: address,
        enrollmentdate: enrollmentdate
    };
    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if(jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollno").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}
