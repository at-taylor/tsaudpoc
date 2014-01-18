var audioRecordApp = {

    // need to be passed to the constructor the UI elements to use
    audioStartRecFieldId: null,
    audioStopRecFieldId: null,
    audioPlayerFieldId: null,
    audioDebugFieldId: null,
    audioRecordStatusDiv: null,
    audioRecordStatusCounterDiv: null,

    // 'prviate' instance variables
    audioRecorder: null,
    progressTimer: null,
    recTime:0,
// for recording: do not specify any directory
    mediaFileFullName: null,
    mediaRecFile: "myRecording.wav",

    // const
    audioStateEnum : {start: 1,
                    recording: 2,
                    finishRec: 3
                    },
    audioMaxRecordSecs: 900,   // maximum is 15 minutes

    // Application Constructor
    initialize: function(audioStartRecFieldId, audioStopRecFieldId, audioPlayerFieldId,
                         audioRecordStatusDiv, audioRecordStatusCounterDiv, audioDebugFieldId) {

        this.audioDebugFieldId = audioDebugFieldId;

        this.logLine( "audioRecordApp: initialize(): start: audioStart: " + audioStartRecFieldId);

        this.audioRecorder = null;
        this.progressTimer = null;
        this.recTime = null;
        this.mediaFileFullName = null;

        this.audioStartRecFieldId = audioStartRecFieldId;
        this.audioStopRecFieldId = audioStopRecFieldId;
        this.audioPlayerFieldId = audioPlayerFieldId;
        this.audioRecordStatusDiv = audioRecordStatusDiv;
        this.audioRecordStatusCounterDiv = audioRecordStatusCounterDiv;

        this.bindEvents();

        this.setButtonState(this.audioStateEnum.start);

        this.logLine("audioRecordApp: initialize(): end: audioStart: " + audioStartRecFieldId);
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {

        this.logLine("audioRecordApp: bindEvents(): start");

        //document.getElementById(this.audioStartRecFieldId).addEventListener('click', startRecording, false);
        //document.getElementById(this.audioStopRecFieldId).addEventListener('click', this.stopRecording(), false);

        this.logLine("audioRecordApp: bindEvents(): end");
    },

    startRecording: function () {
        this.logLine("audioRecordApp: startRecording(): start");
        // change buttons state
        this.setButtonState(this.audioStateEnum.recording);

        // create media object - overwrite existing recording
//        if (this.audioRecorder)
//            this.audioRecorder.release();
//
//        //first create the file   then the success handler will launch recording to the file
//        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccessFileSystem(), onFailFileSystem());
        this.logLine("audioRecordApp: startRecording(): end");
    },


    stopRecording: function() {

        function clearAudioTimer(objRef) {

            objRef.logLine("audioRecordApp: stopRecording.clearAudioTimer");
            if (objRef.progressTimer) {
                clearInterval(objRef.progressTimer);
                objRef.progressTimer = null;
            }
        }

        function setAudioPlayerToRecordedFile(objRef) {

            objRef.logLine("audioRecordApp: stopRecording.setAudioPlayerToRecordedFile: start");

            var fullPlayerName = '#' + objRef.audioPlayerFieldId;
            $(fullPlayerName).jPlayer("setMedia", {
//                        m4a:"http://www.jplayer.org/audio/m4a/TSP-01-Cro_magnon_man.m4a",
//                        oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
                wav: objRef.mediaFileFullName
            });

            objRef.logLine("audioRecordApp: stopRecording.setAudioPlayerToRecordedFile: end");
        }

        this.logLine("audioRecordApp: stopRecording(): start");

        // $('#'+ this.audioPlayerFieldId).attr("src", mediaFileFullName);
        this.mediaFileFullName =   "G2MTestSound.wav";
        setAudioPlayerToRecordedFile(this);

        this.setButtonState(this.audioStateEnum.finishRec);

        //if (this.audioRecorder)
        //    this.audioRecorder.stopRecord(); // the file should be moved to "/sdcard/"+mediaRecFile

        clearAudioTimer(this);

        document.getElementById(this.audioRecordStatusDiv).innerHTML = "<p>Recording Stopped</p>";

        this.logLine("audioRecordApp: stopRecording(): end");
    },

    setButtonState: function(targetState) {

        var msg = "audioRecordApp: setButtonState(): start: state requested: " + targetState;
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

        if (targetState == this.audioStateEnum.start) // only "record" is enabled
            {
            $('#'+this.audioStartRecFieldId).removeClass('ui-disabled') ;
            $('#'+this.audioStopRecFieldId).addClass('ui-disabled') ;

        }
        else if (targetState == this.audioStateEnum.recording) // only "stoprec" is enabled
        {
            $('#'+this.audioStartRecFieldId).addClass('ui-disabled') ;
            $('#'+this.audioStopRecFieldId).removeClass('ui-disabled') ;
        }
        else if (targetState == this.audioStateEnum.finishRec)      // this could be used to enable a remove or restart button
        {
            $('#'+this.audioStartRecFieldId).removeClass('ui-disabled') ;
            $('#'+this.audioStopRecFieldId).addClass('ui-disabled') ;
        }

        msg = "audioRecordApp: setButtonState(): end: state requested: " + targetState;
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

    } ,
    logLine: function (msg) {

        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');
    }

}