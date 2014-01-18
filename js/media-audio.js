//  parms
var audioIsJPlayer = "false";

// control set
var audioStartRecFieldId= null;
var audioStopRecFieldId=null;
var audioJPlayerFieldId=null;
var audioPlayerFieldId=null;
var audioDebugFieldId=null;
var audioRecordStatusDiv=null;
var audioRecordStatusCounterDiv=null;

// 'prviate' instance variables
var audioRecorder = null;
var progressTimer = null;
var recTime = 0;
var mediaFileFullName = null;

// const
var audioStateEnum= {start: 1,
                    recording: 2,
                    finishRec: 3
                    }
var audioMaxRecordSecs =  900;  // maximum is 15 minutes
var mediaRecFile = "myRecording.wav";

function audioLogLine(msg) {

    console.log(msg);
    $('#'+audioDebugFieldId).val($('#'+ audioDebugFieldId).val() + msg + '\n');
}

function audioInitialize(_audioStartRecFieldId, _audioStopRecFieldId, _audioPlayerFieldId, _audioJPlayerFieldId,
         _audioRecordStatusDiv, _audioRecordStatusCounterDiv, _audioDebugFieldId) {

   audioDebugFieldId = _audioDebugFieldId;

    audioLogLine( "audioRecordApp: initialize(): start: audioStart: " + _audioStartRecFieldId);

    audioRecorder = null;
    progressTimer = null;
    recTime = null;
    mediaFileFullName = null;

    audioStartRecFieldId = _audioStartRecFieldId;
    audioStopRecFieldId = _audioStopRecFieldId;
    audioPlayerFieldId = _audioPlayerFieldId;
    audioJPlayerFieldId = _audioJPlayerFieldId;
    audioRecordStatusDiv = _audioRecordStatusDiv;
    audioRecordStatusCounterDiv = _audioRecordStatusCounterDiv;

    if (audioIsJPlayer == "true")
        audioJsCreateJPlayer("G2MTestSound.wav");

    audioJsSetButtonState(audioStateEnum.start);

    audioLogLine("audioRecordApp: initialize(): end: audioStart: " + audioStartRecFieldId);
}

function audioJsCreateJPlayer(fileName) {

    audioLogLine("audioJs: audioCreateJPlayer(): start called with: " + fileName + " JPlayer control field: " + audioJPlayerFieldId);

    $('#'+audioJPlayerFieldId).jPlayer({
        ready: function (event) {
            $(this).jPlayer("setMedia", {
//                        m4a:"http://www.jplayer.org/audio/m4a/TSP-01-Cro_magnon_man.m4a",
//                        oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
                wav: fileName
            });
        },
        swfPath: "js",
        //supplied: "m4a, oga",
        supplied: "wav",
        wmode: "window",
        smoothPlayBar: true,
        keyEnabled: true
    });

    audioLogLine("audioJs: audioCreateJPlayer(): end called with: " + fileName);

}

function audioJsSwitchFile() {

    audioLogLine("audioJs: audioSwitchFile(): start");

    audioSetPlayerFileName(audioJPlayerFieldId, "G2MTestSound.wav");

    audioLogLine("audioJs: audioSwitchFile(): end");

}

function audioSetPlayerFileName(playerName, fileName) {

    audioLogLine("audioJs: audioSetPlayerFileName(): start called with: Player: " + playerName + " File: " + fileName);

    var fullPlayerName = '#' + playerName;
    $(fullPlayerName).jPlayer("setMedia", {
//                        m4a:"http://www.jplayer.org/audio/m4a/TSP-01-Cro_magnon_man.m4a",
//                        oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
        wav: fileName
    });

    audioLogLine( "audioJs: audioSetPlayerFileName(): end called with: " + fileName);
}

function audioJsStartRecording() {

    audioLogLine("audioJs: audioJsStartRecording(): start");

    // change buttons state
    audioJsSetButtonState(audioStateEnum.recording);

    // create media object - overwrite existing recording
    if (audioRecorder)
        audioRecorder.release();

    //first create the file   then the success handler will launch recording to the file
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, audioJsOnSuccessContinueRecordingInit, function() {
        audioLogLine("audioJs: audioJsStartRecording(): failed in requestFileSystem call");
    });

    audioLogLine("audioJs: audioJsStartRecording(): end");
}

function audioJsOnSuccessContinueRecordingInit(fileSystem) {

    audioLogLine("audioJs: audioJsOnSuccessContinueRecordingInit(): start");
    audioLogLine("audioJs: audioJsOnSuccessContinueRecordingInit(): Root File System Name: " + fileSystem.root.name);

    fileSystem.root.getFile(mediaRecFile, { create: true, exclusive: false }, audioJsOnSuccessCompleteRecordingInit, function() {
        audioLogLine("audioJs: audioJsOnSuccessContinueRecordingInit(): failed in getFile() call");
    });

    audioLogLine("audioJs: audioJsOnSuccessContinueRecordingInit(): end");
}

function audioJsOnSuccessCompleteRecordingInit(fileEntry) {

    audioLogLine("audioJs: audioJsonSuccessCompleteRecordingInit(): start");
    audioLogLine( "audioJs: audioJsonSuccessCompleteRecordingInit(): File Name: " + mediaRecFile + " at " + fileEntry.fullPath);

    // save the full file name
    mediaFileFullName = fileEntry.fullPath;
    mediaRecFile = mediaFileFullName;

    audioLogLine("audioJs: audioJsonSuccessCompleteRecordingInit(): about the create Media object");
    // create media object using full media file name
    audioRecorder = new Media(mediaRecFile, function() {
       audioLogLine("audioJs: audioJsonSuccessCompleteRecordingInit(): Media Object Create: success");
    }, function() {
        audioLogLine("audioJs: audioJsonSuccessCompleteRecordingInit(): Media Object Create: fail");
    });

    // specific for iOS device: recording start here in call-back function
    audioJsRecordLaunch();

    audioLogLine("audioJs: audioJsonSuccessCompleteRecordingInit(): end");

}

function audioJsRecordLaunch() {

    audioLogLine("audioJs: audioJsRecordLaunch(): start");

    if (audioRecorder) {
        audioRecorder.startRecord();
        document.getElementById(audioRecordStatusDiv).innerHTML = "Recording .....";
        audioLogLine("audioJs: audioJsRecordLaunch(): recorder.startRecord()");
    }
    else   {
        //console.log("***test:  my_recorder==null: in audioJsStartRecording()***");
        audioLogLine("audioJs: audioJsRecordLaunch(): recorder.startRecord(): NULL RECORDER");
    }

    // reset the recTime every time when recording
    recTime = 0;
    // Stop recording after 10 sec
    progressTimer = setInterval(function() {
        recTime = recTime + 1;
        document.getElementById(audioRecordStatusCounterDiv).innerHTML = "<p></p>Recording Length: "+ recTime + " sec";
//        if (recTime >= audioMaxRecordSecs)
//            audioJsStopRecording();
    }, 1000);

    audioLogLine("audioJs: audioJsRecordLaunch(): end");
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

    audioLogLine("audioJs: audioJsStopRecording(): start. ");

    if (audioRecorder)
        audioRecorder.stopRecord(); // the file should be moved to "/sdcard/"+mediaRecFile

    if (audioIsJPlayer == "false")
        $('#'+audioPlayerFieldId).attr("src", mediaFileFullName);
    else
        audioSetPlayerFileName(audioJPlayerFieldId, mediaFileFullName);

    audioJsSetButtonState(audioStateEnum.finishRec);

    audioJsClearProgressTimer();

    document.getElementById(audioRecordStatusDiv).innerHTML = "<p>Recording stopped.</p>";

    audioLogLine("audioJs: audioJsStopRecording(): end. ");
}

function audioJsSetButtonState(targetState)
{

    audioLogLine("audioRecordApp: setButtonState(): start: state requested: " + targetState);

    if (targetState == audioStateEnum.start) // only "record" is enabled
    {
        $('#'+audioStartRecFieldId).removeClass('ui-disabled') ;
        $('#'+audioStopRecFieldId).addClass('ui-disabled') ;

    }
    else if (targetState == audioStateEnum.recording) // only "stoprec" is enabled
    {
        $('#'+audioStartRecFieldId).addClass('ui-disabled') ;
        $('#'+audioStopRecFieldId).removeClass('ui-disabled') ;
    }
    else if (targetState == this.audioStateEnum.finishRec)      // this could be used to enable a remove or restart button
    {
        $('#'+audioStartRecFieldId).removeClass('ui-disabled') ;
        $('#'+audioStopRecFieldId).addClass('ui-disabled') ;
    }

    audioLogLine("audioRecordApp: setButtonState(): end: state requested: " + targetState);

}