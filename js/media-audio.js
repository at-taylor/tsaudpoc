

var my_recorder = null
var progressTimer = null;
var recTime = 0;

// for recording: do not specify any directory
var mediaFileFullName = null;
var mediaRecFile = "myRecording.wav";

var myMediaState = {start: 1,
    recording: 2,
    finishRec: 3
//    playback: 4,
//    paused: 5,
//    stopped: 6
    };

/* console.log et al are not always available in Firefox. This silences it and prevents a JS error. */
if(typeof console === "undefined") {
    console = { log: function() { } };
}

function audioJsStartRecording() {

    var msg = "audioJs: audioJsStartRecording(): start";
    console.log(msg);
    $('#audioJsDebugArea').val( $('#audioJsDebugArea').val() + msg + '\n');

    // change buttons state
    audioJsSetButtonState(myMediaState.recording);

    // create media object - overwrite existing recording
    if (my_recorder)
        my_recorder.release();

    //first create the file   then the success handler will launch recording to the file
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, audioJsOnSuccessContinueRecordingInit, function() {
        console.log("***test: failed in creating media file in requestFileSystem");
        msg = "audioJs: audioJsStartRecording(): failed in requestFileSystem call";
        console.log(msg);
        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    });

    msg = "audioJs: audioJsStartRecording(): end";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

}

function audioJsOnSuccessContinueRecordingInit(fileSystem) {
    console.log("***test: fileSystem.root.name: " + fileSystem.root.name);

    var msg = "audioJs: audioJsOnSuccessContinueRecordingInit(): start";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    msg = "audioJs: audioJsOnSuccessContinueRecordingInit(): Root File System Name: " + fileSystem.root.name;
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');


//    if (checkFileOnly == true)
//        fileSystem.root.getFile(mediaRecFile, { create: false, exclusive: false }, onOK_GetFile, onFail_GetFile);
//    else
    fileSystem.root.getFile(mediaRecFile, { create: true, exclusive: false }, audioJsonSuccessCompleteRecordingInit, function() {
        msg = "audioJs: audioJsOnSuccessContinueRecordingInit(): failed in getFile() call";
        console.log(msg);
        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    });

    msg = "audioJs: audioJsOnSuccessContinueRecordingInit(): end";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

}

function audioJsonSuccessCompleteRecordingInit(fileEntry) {
    console.log("***test: File " + mediaRecFile + " at " + fileEntry.fullPath);

    var msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): start";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): File Name: " + mediaRecFile + " at " + fileEntry.fullPath;
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    // save the full file name
    mediaFileFullName = fileEntry.fullPath;
    //if (phoneCheck.ios)
    mediaRecFile = mediaFileFullName;
//
//    if (checkFileOnly == true) { // check if file exist at app launch.
//
//        msg = "audioJs: onOK_GetFile(): checkFileOnly==true";
//        console.log(msg);
//        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
//
//        mediaFileExist = true;
//
//        audioJsSetButtonState(myMediaState.finishRec);
//
//        msg = "audioJs: onOK_GetFile(): checkFileOnly==true: after audioJsSetButtonState(finish)";
//        console.log(msg);
//        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
//    }
//    else { // record on iOS

        msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): about the create Media object";
        console.log(msg);
        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

        // create media object using full media file name
        my_recorder = new Media(mediaRecFile, function() {
            msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): Media Object Create: success";
            console.log(msg);
            $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
        }, function() {
            msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): Media Object Create: fail";
            console.log(msg);
            $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
        });

        msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): media Object Created: about to call audioJsRecordLaunch()";
        console.log(msg);
        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

        // specific for iOS device: recording start here in call-back function
        audioJsRecordLaunch();

    msg = "audioJs: audioJsonSuccessCompleteRecordingInit(): end";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
}

function audioJsRecordLaunch() {

    msg = "audioJs: audioJsRecordLaunch(): start";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    
    if (my_recorder) {
        my_recorder.startRecord();
        document.getElementById('audioRecStatusID').innerHTML = "Status: recording";
        //console.log("***test:  recording started: in audioJsStartRecording()***");
        msg = "audioJs: audioJsRecordLaunch(): my_recorder.startRecord()";
        console.log(msg);
        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    }
    else   {
        //console.log("***test:  my_recorder==null: in audioJsStartRecording()***");
        msg = "audioJs: audioJsRecordLaunch(): my_recorder.startRecord(): NULL RECORDER";
        console.log(msg);
        $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    }

    // reset the recTime every time when recording
    recTime = 0;

    // Stop recording after 10 sec
    progressTimer = setInterval(function() {
        recTime = recTime + 1;
        audioJsSetAudioPosition('audioRecPos', recTime + " sec");
        if (recTime >= 10)
            audioJsStopRecording();
        console.log("***test: interval-func()***");
    }, 1000);

    msg = "audioJs: audioJsRecordLaunch(): end";
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
}

// Set audio position
//
function audioJsSetAudioPosition(audioPosID, position) {
    document.getElementById(audioPosID).innerHTML = "<p></p>Audio position: "+position;
}

function audioJsClearProgressTimer() {
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
}


// Stop recording
function audioJsStopRecording() {
    // enable "record" button but disable "stop"

    var msg = "audioJs: audioJsStopRecording(): start. ";
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    msg = "audioJs: audioJsStopRecording(): Src attribute before dynamic set: ";
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    msg =  $("#audioMediaAudioPlayCtl").attr("src")   ;
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    $("#audioMediaAudioPlayCtl").attr("src", mediaFileFullName);

    msg = "audioJs: audioJsStopRecording(): Src attribute after dynamic set: ";
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    msg =  $("#audioMediaAudioPlayCtl").attr("src")   ;
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
    audioJsSetButtonState(myMediaState.finishRec);

    if (my_recorder)
        my_recorder.stopRecord(); // the file should be moved to "/sdcard/"+mediaRecFile

    audioJsClearProgressTimer();

    document.getElementById('audioRecStatusID').innerHTML = "<p>Status: stopped record</p>";
    console.log("***test: recording stopped***");

    var msg = "audioJs: audioJsStopRecording(): end. ";
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');
}

function audioJsSetButtonState(curState)
{
    var msg = "audioJs: mediaHandlers: audioJsSetButtonState: start.  called with: " + curState;
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    var id_disabled_map = {
        "audioStartRecID":false,
        "audioStopRecID":true
//        "startPlayID":true,
//        "pausePlayID":true,
//        "stopPlayID":true
    };

    if (curState == myMediaState.start) // only "record" is enabled
    {
        console.log("***test:  start state #####");
    }
    else if (curState == myMediaState.recording) // only "stoprec" is enabled
    {
        console.log("***test:  recording state #####");
        id_disabled_map["audioStartRecID"] = true;
        id_disabled_map["audioStopRecID"] = false;
    }
    else if ((curState == myMediaState.finishRec) ||
        (curState == myMediaState.stopped)) // only "record", "play" are enabled
    {
        console.log("***test:  finishing/stopped state #####");
       // id_disabled_map["audioStartPlayID"] = false;
    }
//    else if (curState == myMediaState.playback)  // only "pause", "stop" are enabled
//    {
//        console.log("***test:  playback state #####");
//        id_disabled_map["startRecID"] = true;
//        id_disabled_map["startPlayID"] = true;
//    }
//    else if (curState == myMediaState.paused)  // only "play", "record" & "stop" are enabled
//    {
//        console.log("***test:  paused state #####");
//        id_disabled_map["startPlayID"] = false;
//        id_disabled_map["stopPlayID"] = false;
//    }
    else
    {
        console.log("***  unknown media state");
    }

    var keys = Object.keys(id_disabled_map); //the list of ids: ["startRecID", "stopRecID",...]
    keys.forEach(function(id){ document.getElementById(id).disabled = id_disabled_map[id];});

    var msg = "audioJs: mediaHandlers: audioJsSetButtonState: end.  called with: " + curState;
    console.log(msg);
    $('#audioJsDebugArea').val($('#audioJsDebugArea').val() + msg + '\n');

    return(id_disabled_map);
}