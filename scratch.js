/                var networkState = navigator.connection.type;
//
//                setTimeout(function(){
//
//                    networkState = navigator.connection.type; // have to do this second time to pick up the refreshed value
//
//                    var states = {};
//                    states[Connection.UNKNOWN] = 'Unknown connection';
//                    states[Connection.ETHERNET] = 'Ethernet connection';
//                    states[Connection.WIFI] = 'WiFi connection';
//                    states[Connection.CELL_2G] = 'Cell 2G connection';
//                    states[Connection.CELL_3G] = 'Cell 3G connection';
//                    states[Connection.CELL_4G] = 'Cell 4G connection';
//                    states[Connection.CELL] = 'Cell generic connection';
//                    states[Connection.NONE] = 'No network connection';
//
//                    msg = "pocPage: onDeviceReady: trying a timeout delay";
//                    console.log(msg);
//                    $('#pocPageDebugArea').val($('#pocPageDebugArea').val() + msg + '\n');
//
//                    alert('Connection type: ' + states[networkState]);
//
//                }, 500);

//                msg = "pocPage: onDeviceReady: after network connection type";
//                console.log(msg);
//                $('#pocPageDebugArea').val($('#pocPageDebugArea').val() + msg + '\n');
//
//                msg = "pocPage: onDeviceReady: networkState: " + networkState;
//                console.log(msg);
//                $('#pocPageDebugArea').val($('#pocPageDebugArea').val() + msg + '\n');
//                //$('#pocPageNetworkConn').val(networkState);
//
//                var states = {};
//                states[Connection.UNKNOWN]  = 'Unknown connection';
//                states[Connection.ETHERNET] = 'Ethernet connection';
//                states[Connection.WIFI]     = 'WiFi connection';
//                states[Connection.CELL_2G]  = 'Cell 2G connection';
//                states[Connection.CELL_3G]  = 'Cell 3G connection';
//                states[Connection.CELL_4G]  = 'Cell 4G connection';
//                states[Connection.NONE]     = 'No network connection';
//
//                //$('pocPageNetworkConn').val(states[networkState]);
//
//                msg = "pocPage: onDeviceReady: states: " + states[networkState];
//                console.log(msg);
//                $('#pocPageDebugArea').val($('#pocPageDebugArea').val() + msg + '\n');
//
//                msg = "pocPage: onDeviceReady: end";
//                console.log(msg);
//                $('#pocPageDebugArea').val($('#pocPageDebugArea').val() + msg + '\n');
//
//                alert('Connection type: ' + states[networkState]);