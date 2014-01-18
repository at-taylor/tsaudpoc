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

    startRecording: function() {


        function launchRecording() {
            this.logLine("audioRecordApp: startRecording.launchRecording start");

            if (this.audioRecorder) {
                this.audioRecorder.startRecord();
                document.getElementById(this.audioRecordStatusDiv).innerHTML = "Recording ....";
                //console.log("***test:  recording started: in audioJsStartRecording()***");
            }
            else   {
                //console.log("***test:  my_recorder==null: in audioJsStartRecording()***");
                this.logLine("audioRecordApp: startRecording.launchRecording: NULL RECORDER");
            }

            // reset the recTime every time when recording
            this.recTime = 0;
            // Stop recording after 10 sec
            this.progressTimer = setInterval(function() {
                this.recTime = this.recTime + 1;
                setAudioCounter(this.audioRecordStatusCounterDiv, this.recTime + " sec");
                if (this.recTime >= this.audioMaxRecordSecs)
                    this.stopRecording();
            }, 1000);

            this.logLine("audioRecordApp: startRecording.launchRecording end");
        }
        function onSuccessFileSystem(objRef, fileSystem) {

            objRef.logLine("audioRecordApp: startRecording.onSuccessFileSystem(): start");
            objRef.logLine("audioRecordApp: startRecording.onSuccessFileSystem(): Root File System Name: " + fileSystem.root.name);

            fileSystem.root.getFile(objRef.mediaRecFile, { create: true, exclusive: false }, onSuccessGetAudioFile(objRef), onFailFileSystem(objRef)) ;

            objRef.logLine("audioRecordApp: startRecording.onSuccessFileSystem(): end");
        }

        function onFailFileSystem(objRef, evt) {

            objRef.logLine("audioRecordApp: startRecording(): failed in requestFileSystem call.  Error: " + evt.target.error.code);

        }

        function onSuccessGetAudioFile(objRef, fileEntry) {

            objRef.logLine("audioRecordApp: startRecording.onSuccessGetAudioFile:  File Name: " + objRef.mediaRecFile + " at " + fileEntry.fullPath);

            // save the full file name
            objRef.mediaFileFullName = fileEntry.fullPath;
            objRef.mediaRecFile = objRef.mediaFileFullName;

            // create media object using full media file name
            objRef.audioRecorder = new Media(objRef.mediaRecFile, function(objRef) {
                objRef.logLine("audioRecordApp: startRecording.onSuccessGetAudioFile Media Object Create: success");
            }, function(objRef) {
                objRef.logLine("audioRecordApp: startRecording.onSuccessGetAudioFile Media Object Create: fail");
            });

            // specific for iOS device: recording start here in call-back function
            launchRecording();

            objRef.logLine("audioRecordApp: startRecording.onSuccessGetAudioFile: end");
        }

        function setAudioCounter(audioCounterID, position) {

            document.getElementById(audioCounterID).innerHTML = "<p></p> "+position;
        }

        this.logLine("audioRecordApp: startRecording(): start");
        // change buttons state
        this.setButtonState(this.audioStateEnum.recording);

        // create media object - overwrite existing recording
        if (this.audioRecorder)
            this.audioRecorder.release();

        //first create the file   then the success handler will launch recording to the file
        //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccessFileSystem(this), onFailFileSystem(this));

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0
            , function () {
                this.logLine("in the filesystem inline:" + this.mediaRecFile)         ;
                fileSystem.root.getFile(this.mediaRecFile, { create: true, exclusive: false }, onSuccessGetAudioFile(objRef), onFailFileSystem(objRef)) ;
            }
            , onFailFileSystem(this));

        //onSuccessFileSystem(this, "filesystem");
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