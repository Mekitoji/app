//var
/*var addRowButton = document.getElementById('plus-row'),
  n = 1,
  g = 1,
  h = 1,
  j = 0;
//functions
var addRow = function addRow() {
  //firstly do count
  n = ++n;
  g = ++g;
  //then do this
  var tableListRow = '<td>' + g + '</td><td><select name="country" id="table-country"><option value="Russia">Russia</option><option value="Ukraine">Ukraine</option><option value="Belarus">Belarus</option><option value="Latvia">Latvia</option><option value="Kazakhstan">Kazakhstan</option><option value="Lithuania">Lithuania</option><option value="Estonia">Estonia</option><option value="Uzbekistan">Uzbekistan</option></select></td><td><input type="text" class="app-name" ng-model=\'appname' + g + '\'></td><td><select name="category" id="table-category"><option value="OTT">OTT</option><option value="Pay TV">Pay TV</option><option value="Broadcast">Broadcast</option><option value="OTT + Pay TV">OTT + Pay TV</option><option value="Others">Others</option></select></td><td><select name="sdp-status" id="table-sdp-status"><option value="Gk review request">Gk review request</option><option value="GK rewiev">GK rewiev</option><option value="GK Review Reject">GK Review Reject</option><option value="Verification Request">Verification Request</option><option value="Pre-test">Pre-test</option><option value="Function Testing">Function Testing</option><option value="Content Testing">Content Testing</option><option value="Final review">Final review</option><option value="App QA Approved">App QA Approved</option><option value="App QA Rejected">App QA Rejected</option></select></td><td><input type="date"></td><td><input type="text"></td><td><select name="Tv" id="table-tv"><option value="Reject">Reject</option><option value="Approve">Approve</option><option value="Partial">Partial</option></select></td><td><select name="current-status" id="table-current-status"><option value="Waiting for fix">Waiting for fix</option><option value="Waiting for test">Waiting for test</option><option value="Waiting for QA">Waiting for QA</option></select></td><td><input type="text"></td><td><span id=\'reply-time\'></span></td><td><select name="resp" id="table-resp"><option value="YK">YK</option><option value="DP">DP</option><option value="VE">VE</option><option value="AS">AS</option></select></td><td id="current" onclick="addRow()""><button  class=\' btn btn-primary add-row-btn\'><span class="glyphicon glyphicon-plus"></span></button></td>',
    tableCalendarRow = '<td class=\'take-app-name ng-binding\' >{{appname' + g + '}}</td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td><td><select name="" id=""></select></td>',
    addSaveButton = '<button class=\'btn btn-primary save-button\'><span class=\'glyphicon glyphicon-floppy-save\'></span>',
    tableList = document.getElementById('main-list-table').childNodes[1],
    rowList = document.createElement('tr'),
    rowCalendar = document.createElement('tr'),
    tdSaveButton = document.createElement('td'),
    btnSave = document.getElementsByClassName('save-button'),
    tableCalendar = document.getElementById('main-calendar-table').childNodes[1];


  tdSaveButton.innerHTML = addSaveButton;
  rowList.innerHTML = tableListRow;
  rowCalendar.innerHTML = tableCalendarRow;
  tableList.appendChild(rowList);
  tableCalendar.appendChild(rowCalendar);

  $('#current').detach();
  if (n == 3) {
    n = ++n;
  }
  var tableListTr = tableList.childNodes[n];

  tableListTr.appendChild(tdSaveButton);


  j = ++j;
  h = ++h;
}*/

/*var updateAppName = function updateAppName(j) {
  var appName = document.getElementsByClassName('app-name');
  var takeAppName = document.getElementsByClassName('take-app-name');

  takeAppName[j].innerHTML = appName[j].value;
}*/



//Listeners
// addRowButton.addEventListener('click', addRow);