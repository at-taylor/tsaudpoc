var audioRecordApp = {

    // need to be passed to the constructor
    audioStartRecFieldId: null,
    audioStopRecFieldId: null,
    audioPlayerFieldId: null,
    audioDebugFieldId: null,

    // 'prviate' variables
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

    // Application Constructor
    initialize: function(audioStartRecFieldId, audioStopRecFieldId, audioPlayerFieldId, audioDebugFieldId) {

        var msg = "audioRecordApp: initialize(): start: audioStart: " + audioStartRecFieldId;
        console.log(msg);
        this.audioDebugFieldId = audioDebugFieldId;

        $('#'+audioDebugFieldId).val($('#'+audioDebugFieldId).val() + msg + '\n');

        this.audioRecorder = null;
        this.progressTime = null;
        this.recTime == null;
        this.mediaFileFullName = null;

        this.audioStartRecFieldId = audioStartRecFieldId;
        this.audioStopRecFieldId = audioStopRecFieldId;
        this.audioPlayerFieldId = audioPlayerFieldId;

        this.bindEvents();

        this.setButtonState(this.audioStateEnum.start);

        msg = "audioRecordApp: initialize(): end: audioStart: " + audioStartRecFieldId;
        console.log(msg);

        $('#'+audioDebugFieldId).val($('#'+audioDebugFieldId).val() + msg + '\n');
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {

        var msg = "audioRecordApp: bindEvents(): start";
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');
        // alert('before binding events');

        document.getElementById(this.audioStartRecFieldId).addEventListener('click', this.startRecording, false);
        document.getElementById(this.audioStopRecFieldId).addEventListener('click', this.stopRecording, false);

        msg = "audioRecordApp: bindEvents(): end";
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

    },
    startRecording: function() {

        var msg = "audioRecordApp: startRecording(): start";
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

        msg = "audioRecordApp: startRecording(): end";
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

    },

    stopRecording: function() {

        var msg = "audioRecordApp: stopRecording(): start";
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

        msg = "audioRecordApp: stopRecording(): end";
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

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
        else if (targetState == myMediaState.recording) // only "stoprec" is enabled
        {
            $('#'+this.audioStartRecFieldId).addClass('ui-disabled') ;
            $('#'+this.audioStopRecFieldId).removeClass('ui-disabled') ;
        }
        else if (targetState == myMediaState.finishRec)      // this could be used to enable a remove or restart button
        {

        }

        msg = "audioRecordApp: setButtonState(): end: state requested: " + targetState;
        console.log(msg);
        $('#'+this.audioDebugFieldId).val($('#'+this.audioDebugFieldId).val() + msg + '\n');

    }


}