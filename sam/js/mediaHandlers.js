/*
* Copyright (c) 2012, Intel Corporation. All rights reserved.
* File revision: 04 October 2012
* Please see http://software.intel.com/html5/license/samples 
* and the included README.md file for license terms and conditions.
*/

var my_recorder = null, my_player = null;
var progressTimmer = null;
var createdStatus = false;
var recTime = 0;

// for recording: do not specify any directory
var mediaFileFullName = null; 
var mediaRecFile = "myRecording.wav";
var checkFileOnly = false;
var mediaFileExist = false;
var myMediaState = {start: 1, 
                    recording: 2, 
                    finishRec: 3, 
                    playback: 4, 
                    paused: 5,
                    stopped: 6 };

/* console.log et al are not always available in Firefox. This silences it and prevents a JS error. */
if(typeof console === "undefined") {
    console = { log: function() { } };
}   



function onOK_GetFile(fileEntry) {
    console.log("***test: File " + mediaRecFile + " at " + fileEntry.fullPath);

    var msg = "pocMediaPage: onOK_GetFile(): start";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    msg = "pocMediaPage: onOK_GetFile(): File Name: " + mediaRecFile + " at " + fileEntry.fullPath;
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    // save the full file name
    mediaFileFullName = fileEntry.fullPath;
    //if (phoneCheck.ios)
        mediaRecFile = mediaFileFullName;

    if (checkFileOnly == true) { // check if file exist at app launch.

        msg = "pocMediaPage: onOK_GetFile(): checkFileOnly==true";
        console.log(msg);
        $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

        mediaFileExist = true;
        
        setButtonState(myMediaState.finishRec);

        msg = "pocMediaPage: onOK_GetFile(): checkFileOnly==true: after setButtonState(finish)";
        console.log(msg);
        $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    } 
    else { // record on iOS

        msg = "pocMediaPage: onOK_GetFile(): checkFileOnly==false: start";
        console.log(msg);
        $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

        // create media object using full media file name 
        my_recorder = new Media(mediaRecFile, onMediaCallSuccess, onMediaCallError);

        msg = "pocMediaPage: onOK_GetFile(): checkFileOnly==false: about to call recordNow()";
        console.log(msg);
        $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

        // specific for iOS device: recording start here in call-back function
        recordNow();

        msg = "pocMediaPage: onOK_GetFile(): checkFileOnly==false: end";
        console.log(msg);
        $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    }

    msg = "pocMediaPage: onOK_GetFile(): end";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
}

function onFail_GetFile(evt) {

    var msg = "pocMediaPage: onFail_GetFile(): ";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    msg = "pocMediaPage: onFail_GetFile(): error code: " + evt.target.error.code;
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

}

function onSuccessFileSystem(fileSystem) {
    console.log("***test: fileSystem.root.name: " + fileSystem.root.name);

    var msg = "pocMediaPage: onSuccessFileSystem(): start";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    msg = "pocMediaPage: onSuccessFileSystem(): Root File System Name: " + fileSystem.root.name;
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');


    if (checkFileOnly == true)
        fileSystem.root.getFile(mediaRecFile, { create: false, exclusive: false }, onOK_GetFile, onFail_GetFile);
    else
        fileSystem.root.getFile(mediaRecFile, { create: true, exclusive: false }, onOK_GetFile, onFail_GetFile);

    msg = "pocMediaPage: onSuccessFileSystem(): end";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    
}

function onFailFileSystem (evt){

    var msg = "pocMediaPage: onFailFileSystem(): start";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    console.log(evt.target.error.code);

    msg = "pocMediaPage: onFailFileSystem(): error code: " + evt.target.error.code;
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    var msg = "pocMediaPage: onFailFileSystem(): end";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

}
function checkMediaRecFileExist() {

    var msg = "pocMediaPage: checkMediaRecFileExist(): start";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    checkFileOnly = true;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccessFileSystem, null);

    msg = "pocMediaPage: checkMediaRecFileExist(): end";
    console.log(msg);

    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
}

function recordNow() {
    if (my_recorder) {
        my_recorder.startRecord();
        document.getElementById('RecStatusID').innerHTML = "Status: recording";
        console.log("***test:  recording started: in startRecording()***");
    }
    else
        console.log("***test:  my_recorder==null: in startRecording()***");

    // reset the recTime every time when recording
    recTime = 0;

    // Stop recording after 10 sec
    progressTimmer = setInterval(function() {
        recTime = recTime + 1;
        setAudioPosition('media_rec_pos', recTime + " sec");
        if (recTime >= 10)
            stopRecording();
        console.log("***test: interval-func()***");
    }, 1000);
}

// Record audio    
//     
function startRecording() {

    var msg = "pocMediaPage: startRecording(): start";
    console.log(msg);
    $('#pocMediaPageDebugArea').val( $('#pocMediaPageDebugArea').val() + msg + '\n');

    // change buttons state
    setButtonState(myMediaState.recording);

    // create media object - overwrite existing recording
    if (my_recorder)
        my_recorder.release();

//    if (phoneCheck.android) {
//        my_recorder = new Media(mediaRecFile, onMediaCallSuccess, onMediaCallError);
//        console.log("***test: new Media() for android ***");
//
//        recordNow();
//    }
//    else if (phoneCheck.windows7) {
//        my_recorder = new Media(mediaRecFile, onMediaCallSuccess, onMediaCallError);
//        console.log("***test: new Media() for Windows7 ***");
//
//        recordNow();
//    }
//    else if (phoneCheck.ios) {
        //first create the file
        checkFileOnly = false;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccessFileSystem, function() {
            console.log("***test: failed in creating media file in requestFileSystem");
            msg = "pocMediaPage: startRecording(): failed in requestFileSystem call";
            console.log(msg);
            $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
        });

//        console.log("***test: new Media() for ios***");
//    }

    msg = "pocMediaPage: startRecording(): end";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    
}

// Stop recording
function stopRecording() {
    // enable "record" button but disable "stop"

    var msg = "pocMediaPage: stopRecording(): start. ";
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    msg = "pocMediaPage: stopRecording(): Src attribute before dynamic set: ";
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    msg =  $("#pocMediaAudioPlayCtl").attr("src")   ;
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    $("#pocMediaAudioPlayCtl").attr("src", mediaFileFullName);

    msg = "pocMediaPage: stopRecording(): Src attribute after dynamic set: ";
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    msg =  $("#pocMediaAudioPlayCtl").attr("src")   ;
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
    setButtonState(myMediaState.finishRec);

    if (my_recorder) 
        my_recorder.stopRecord(); // the file should be moved to "/sdcard/"+mediaRecFile

    clearProgressTimmer();

    document.getElementById('RecStatusID').innerHTML = "<p>Status: stopped record</p>";
    console.log("***test: recording stopped***");

    var msg = "pocMediaPage: stopRecording(): end. ";
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');
}

// Play audio        
//
function playMusic() {
    if (my_player === null) { // play existing media recorded from previous session
        
        // the existing medail should be on /sdcard/ for android. 
        if (phoneCheck.android) {
            my_player = new Media("/sdcard/" + mediaRecFile, onMediaCallSuccess, onMediaCallError);

            console.log("***test:  Open file:" + mediaRecFile);
        } else if (phoneCheck.windows7) // windows 7.1 phone
            my_player = new Media(mediaRecFile, onMediaCallSuccess, onMediaCallError);
        else if (phoneCheck.ios) {
            my_player = new Media(mediaFileFullName, onMediaCallSuccess, onMediaCallError);
        }
    }

    // Play audio
    if (my_player) {
        my_player.play();
        document.getElementById('PlayStatusID').innerHTML = "<p></p>Status: playing...";

        setButtonState(myMediaState.playback);

        // Update media position every second
        clearProgressTimmer();
        progressTimmer = setInterval(function () {
            // get my_player position
            my_player.getCurrentPosition(
            // success callback
            function (position) {
                if (position >= 0)
                    setAudioPosition('media_pos', (position) + " sec");
                else {
                    // reached end of media: same as clicked stop-music 
                    clearProgressTimmer();
                    setAudioPosition('media_pos', "0 sec");
                    document.getElementById('PlayStatusID').innerHTML = "<p>Status: stopped<\p>";
                    setButtonState(myMediaState.stopped);
                }
            },
            // error callback
            function (e) {
                document.getElementById('PlayStatusID').innerHTML = "<p></p>Status: Error on getting position - " + e;
                setAudioPosition("Error: " + e);
            });
        }, 1000);
    }
}
// Pause audio
//
function pauseMusic() {
    if (my_player) {
        my_player.pause();
        document.getElementById('PlayStatusID').innerHTML = "<p>Status: paused</p>";

        clearProgressTimmer();
        setButtonState(myMediaState.paused);
    }
}
// Stop audio        
//         
function stopMusic() {
    if (my_player) {
        setAudioPosition('media_pos', "0 sec");
        setButtonState(myMediaState.stopped);

        my_player.stop();

        // should not be necessary, but it is needed in order to play again. 
        my_player.release()
        my_player = null; 

        clearProgressTimmer();
        document.getElementById('PlayStatusID').innerHTML = "<p>Status: stopped</p>";
    }
}
function clearProgressTimmer() {
    if (progressTimmer) {
        clearInterval(progressTimmer);
        progressTimmer = null;
    } 
}
// Media() success callback        
function onMediaCallSuccess() {

    msg = "pocMediaPage: onMediaCallSuccess(): start";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    createdStatus = true;
    console.log("***test: new Media() succeeded ***");

    msg = "pocMediaPage: onMediaCallSuccess(): end";
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

}
// Media() error callback        
function onMediaCallError(error) {
    console.log("***test: new Media() failed ***");
}
// Set audio position        
//
function setAudioPosition(audioPosID, position) {
    document.getElementById(audioPosID).innerHTML = "<p></p>Audio position: "+position;
}

// only "Record" button is enabled at init state
function setButtonState(curState)
{
    var msg = "pocMediaPage: mediaHandlers: setButtonState: start.  called with: " + curState;
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    var id_disabled_map = {"startRecID":false, 
                             "stopRecID":true, 
                             "startPlayID":true, 
                             "pausePlayID":true, 
                             "stopPlayID":true};

    if (curState == myMediaState.start) // only "record" is enabled
    {
        console.log("***test:  start state #####");
    }                         
    else if (curState == myMediaState.recording) // only "stoprec" is enabled
    {
        console.log("***test:  recording state #####");
        id_disabled_map["startRecID"] = true;
        id_disabled_map["stopRecID"] = false;
    }
    else if ((curState == myMediaState.finishRec) ||
        (curState == myMediaState.stopped)) // only "record", "play" are enabled
    {
        console.log("***test:  finishing/stopped state #####");
        id_disabled_map["startPlayID"] = false;
    }
    else if (curState == myMediaState.playback)  // only "pause", "stop" are enabled
    {
        console.log("***test:  playback state #####");
        id_disabled_map["startRecID"] = true;
        id_disabled_map["startPlayID"] = true;
    }
    else if (curState == myMediaState.paused)  // only "play", "record" & "stop" are enabled
    {
        console.log("***test:  paused state #####");
        id_disabled_map["startPlayID"] = false;
        id_disabled_map["stopPlayID"] = false;
    }
    else
    {
        console.log("***  unknown media state");
    }

    var keys = Object.keys(id_disabled_map); //the list of ids: ["startRecID", "stopRecID",...]
    keys.forEach(function(id){ document.getElementById(id).disabled = id_disabled_map[id];});

    var msg = "pocMediaPage: mediaHandlers: setButtonState: end.  called with: " + curState;
    console.log(msg);
    $('#pocMediaPageDebugArea').val($('#pocMediaPageDebugArea').val() + msg + '\n');

    return(id_disabled_map); 
}
