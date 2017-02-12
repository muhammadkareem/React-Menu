
/*this componet menu return create elemt div value of div is return menu map loop 
paramenter is v index name array wise or i array index (i,v)is a reserve event*/
var Menu = React.createClass({
  render: function() {
    
    var menus = ['Home',  'Excel', 'Tooltips', 'Timer'];

    return React.createElement(
      'div',
      null,
      menus.map((v, i) => {
        return React.createElement(
          'div',
          { key: i },
          React.createElement(Link, { label: v })//v is var 
        );
      })
    );
  }
})
//////////////////////////////////////////////////////////////////////////////////////////
/*link to pass my link var url concatinate '#' to lowercase value trim remove space 
rplace is any contant space change dash- create div block pass ancor 'a' tag 
*/
var Link = React.createClass({
    render: function() {
     
var url='#'
+ this.props.label//
.toLowerCase()//take the value to toLowerCase
.trim()//remove white space 
.replace(' ', '-')//replace method use my array value any space to change dash----
    return React.createElement(
      'div',
      null,
      React.createElement(
        'a',
        { href: url },
        this.props.label
      ),
      React.createElement('br', null)
    );
  }
})

ReactDOM.render(React.createElement(Menu, null), document.getElementById('app'));
/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Excel sheet///////////////////////////////////////////
var headers = [
"Book", "Author", "Language", "Published", "Sales"
];
var data = [
 ["The Lord of the Rings", "J. R. R. Tolkien",
 "English", "1954–1955", "150 million"],
 ["Le Petit Prince (The Little Prince)", "Antoine de Saint-Exupéry",
 "French", "1943", "140 million"],
 ["Harry Potter and the Philosopher's Stone", "J. K. Rowling",
 "English", "1997", "107 million"],
 ["And Then There Were None", "Agatha Christie",
 "English", "1939", "100 million"],
 ["Dream of the Red Chamber", "Cao Xueqin",
 "Chinese", "1754–1791", "100 million"],
 ["The Hobbit", "J. R. R. Tolkien",
 "English", "1937", "100 million"],
 ["She: A History of Adventure", "H. Rider Haggard",
 "English", "1887", "100 million"],
];


var Excel = React.createClass({
displayName:'Excel',


//initial 
getInitialState: function() {
 return {
 data: this.props.initialData,
 sortby: null,
 descending: false,
 edit: null, // [row index, cell index],
 search: false,
 };
},

// sort
_sort: function(e) {
var column = e.target.cellIndex;
var data = this.state.data.slice();
var descending = this.state.sortby === column && !this.state.descending;
data.sort(function(a, b) {
 return descending
 ? (a[column] < b[column] ? 1 : -1)
 : (a[column] > b[column] ? 1 : -1);
});
this.setState({
 data: data,
 sortby: column,
 descending: descending,
});

this.setState({
 data: data,
});
},

//_editor obj
_showEditor: function(e) {
 this.setState({edit: {
 row: parseInt(e.target.dataset.row, 10),
 cell: e.target.cellIndex,
 }});
},
//save 
_save: function(e) {
e.preventDefault();
var input = e.target.firstChild;
var data = this.state.data.slice();
data[this.state.edit.row][this.state.edit.cell] = input.value;
this.setState({
 edit: null, // done editing
 data: data,
});

},

 _preSearchData: null,


propTypes: {
 headers: React.PropTypes.arrayOf(
 React.PropTypes.string
 ),
 initialData: React.PropTypes.arrayOf(
 React.PropTypes.arrayOf(
 React.PropTypes.string
 )
 ),
},


_renderTable: function() {
 return (
 React.DOM.table(null,
 React.DOM.thead({onClick: this._sort},
 React.DOM.tr(null,
 this.props.headers.map(function(title, idx) {
if (this.state.sortby === idx) {
 title += this.state.descending ? ' \u2191' : ' \u2193'
 }
 return React.DOM.th({key: idx}, title);
 },this)
 )
 ),
 React.DOM.tbody({onDoubleClick: this._showEditor},
this._renderSearch(),
 this.state.data.map(function(row, rowidx) {
 return (
 React.DOM.tr({key: rowidx},
 row.map(function(cell, idx) {
    var content = cell;
    //editor
    var edit = this.state.edit;
    if (edit && edit.row === rowidx && edit.cell === idx) {
  content = React.DOM.form({onSubmit: this._save},
 React.DOM.input({
 type: 'text',
 defaultValue: content,
 })
);
}
 return React.DOM.td({key: idx,
 'data-row': rowidx
}, content);
 },this)
 )
 );
 },this)
 )
 )
 );
},

_renderToolbar: function() {
 // TODO
},

_renderToolbar: function() {
 return React.DOM.button(
 {
 onClick: this._toggleSearch,
 className: 'toolbar',
 },
 'search'
 );
},
_toggleSearch: function() {
 if (this.state.search) {
 this.setState({
 data: this._preSearchData,
 search: false,
 });
 this._preSearchData = null;
 } else {
 this._preSearchData = this.state.data;
 this.setState({
 search: true,
 });
 }
},
_search: function(e) {
 var needle = e.target.value.toLowerCase();
 if (!needle) { // the search string is deleted
 this.setState({data: this._preSearchData});
 return;
 }
 var idx = e.target.dataset.idx; // which column to search
 var searchdata = this._preSearchData.filter(function(row) {
 return row[idx].toString().toLowerCase().indexOf(needle) > -1;
 }); this.setState({data: searchdata});
},

_renderToolbar: function() {
 return React.DOM.div({className: 'toolbar'},
 React.DOM.button({
 onClick: this._toggleSearch,

 }, 'Search'),
 React.DOM.a({
 onClick: this._download.bind(this, 'json'),
 href: 'data.json',
 
 }, 'Export JSON'),
 React.DOM.a({
 onClick: this._download.bind(this, 'csv'),
 href: 'data.csv',

 }, 'Export CSV')
 );
},

_download: function(format, ev) {
 var contents = format === 'json'
 ? JSON.stringify(this.state.data)
 : this.state.data.reduce(function(result, row) {
 return result
 + row.reduce(function(rowresult, cell, idx) {
 return rowresult
 + '"'
 + cell.replace(/"/g, '""')
 + '"'
 + (idx < row.length - 1 ? ',' : '');
 }, '')
 + "\n";
 }, '');
 var URL = window.URL || window.webkitURL;
 var blob = new Blob([contents], {type: 'text/' + format});
 ev.target.href = URL.createObjectURL(blob);
 ev.target.download = 'data.' + format;
},


_renderSearch: function() {
 if (!this.state.search) {
 return null;
 }
 return (
 React.DOM.tr({onChange: this._search},
 this.props.headers.map(function(_ignore, idx) {
 return React.DOM.td({key: idx},
 React.DOM.input({
 type: 'text',
 'data-idx': idx,
 })
 );
 })
 )
 );
},

render: function() {
 return (
 React.DOM.div(null,
 this._renderToolbar(),
 this._renderTable()
 )
 );
},

});


//render table 

ReactDOM.render(
 React.createElement(Excel,{
 headers: headers,
 initialData: data,
 }),
 document.getElementById("excel")
);

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////Tooltip app/////////////////////////////////////////////////////

/* Tooltip is a Component react advance this advantages no funtion return
value and obj or more obj comma not impt*/
class Tooltip extends React.Component {
/*constructor object getintialstate attribe super(defualt props)
opacity false  etc
toogle is bind this is means my change state value is my intial props return bind(this)*/
    constructor(props) {
        super(props)
        this.state = {opacity: false}
        this.toggle = this.toggle.bind(this)
    }

    /* const same work as var ...setstate  my opacity value is not a false i means true 
    opacity my Tooltip popup top to left bottom */
    toggle() {
        const toolTipNode = ReactDOM.findDOMNode(this)
        this.setState({
            opacity: !this.state.opacity,
            top: toolTipNode.offsetTop,
            left: toolTipNode.offsetLeft

        })
    }

    
    render() {
         /*const is var style object zIndex return true:false 
    top obj 0/state.top + 10 is position of my text bottom margin
    left obj 0/state.left -40 is text left right position
     */
        const style = {
            zIndex: (this.state.opacity) ? 1000 : -1000,
            opacity: +this.state.opacity,
            top: (this.state.top || 0) + 40,
            left: (this.state.left || 0) -0,
            

        }
/*return create div elem pass attribe style display or value is new element span
pass attribe span text color change or cursor and onMouseEnter or out obj this.toogle
value is this props.childern is my green color tag span or new element create div 
pass class value new div pass class value create new div this.props text 
this is a my popup box element
*/
        return(
      React.createElement(
    'div',
    { style: { display: 'inline' } },
    React.createElement(
        'span',
        { style: { color: 'green', cursor: 'pointer' }, onMouseEnter: this.toggle, onMouseOut: this.toggle },
        this.props.children
    ),
    React.createElement(
        'div',
        { className: 'tooltip bottom', style: style, role: 'tooltip' },
        React.createElement('div', { className: 'tooltip-arrow' }),
        React.createElement(
            'div',
            { className: 'tooltip-inner' },
            this.props.text
        )
    )
)                         
        )
    }
}

/*Use tooltip Component target title of text or text: value is a popup value setState*/
ReactDOM.render(React.createElement(
  "div",
  null,
  React.createElement(
    "h1",
    null,
    "Tooltip REACT"
  ),
  React.createElement(
    Tooltip,
    { text: 'React (JavaScript library)' },
    "'React (JavaScript library),"
  ),
  " a JavaScript library for building user interfaces,from",
   React.createElement(
    Tooltip,
    { text: 'Facebook.' },
    "Facebook,"),
    
   React.createElement("br", null),
   React.createElement(
    Tooltip,
    { text: 'ReactOS' },
    "ReactOS"
  ),
  "an open source operating system compatible with Microsoft Windows",
   React.createElement("br", null),
   React.createElement(
    Tooltip,
    { text: 'React (band)' },
    "React (band),"
  ),
 
  "a 1990s American boys band made of Tim Cruz and Daniel Matrium ",
   React.createElement("br", null),
  React.createElement(
    Tooltip,
    { text: "React (book)," },
    "React (book),"
  ),
  " originally Reacciona, a 2011 Spanish-language book",
  React.createElement("br" ,null),
 
  "Remote Electronically Activated Control Technology belt or ",
  React.createElement(
    Tooltip,
    { text: "REACT belt" },
    "REACT belt"
  ),
  " (though tooltips may be displayed when using a mouse).",
  React.createElement("br", null),
   React.createElement("br", null)
), document.getElementById('tooltips'));



////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////Timer////////////////////////////////////////////////
/* timer Component create check id condition to my props timeLeft value
is null/0 return createElement div or h1 element pass value of time left + props timeLeft
plus add id condition my props value is 0 to play audio alert inside add audio src  */
var  Timer = React.createClass(  {

  render: function() {

    
    if (this.props.timeLeft == null || this.props.timeLeft == 0) 
    return React.createElement('div', null);
    return React.createElement(
      'h1',
      { className: 'timeLeft' },
     'Time left: ',
      this.props.timeLeft
    );
    if (this.props.timeLeft == 0) {
      document.getElementById('finish-time').play();
    }
  }
})



///////////////////////////////////////////////////////////////////////////////////////////

/*componet btn obj return  startTimer props set to props.time is a props value
render obj func return createElement button className use bootstrape changes css styling
2 class name add onClick atributes pass func () return => obj{this.props.startimer (props.time)}
value of btn is number of time + seconds exp: (5 seconds) 5 is props time value pass 
*/
var Button = React.createClass( {

  startTimer: function(event) {
    return this.props.startTimer(this.props.time);
  },

  render:function() {
    return React.createElement(
      'button',
      {
        type: 'button',
        className: 'btn-default btn',
        onClick: () => {
          this.props.startTimer(this.props.time);
        } },
      this.props.time,
      ' seconds'
    );
  }
})


////////////////////////////////////////////////////////////////////////////////////////////
/*this a class componet TimerWrapper */
class TimerWrapper extends React.Component {
    /*constructor work as getintialprops initial state is timeLeft:null
    timer value: null you understod same initial props return props 
      */
  constructor(props) {
    super(props);
    this.state = { timeLeft: null, timer: null };
    this.startTimer = this.startTimer.bind(this);
  }
  /*startTimer is modern obj (timeLeft) is a peramenter of func */
  startTimer(timeLeft) {
/*clearInterval is timer value*/
    clearInterval(this.state.timer);
    let timer = setInterval(() => {
    /*' Inside of setInterval var assign timeLeft decreament - 
    if timeLeft is 0 time is invisble or setState update new timeLeft' 1000 (1 sec back)*/
      var timeLeft = this.state.timeLeft - 1;
      if (timeLeft == 0) clearInterval(timer);
      this.setState({ timeLeft: timeLeft });
    }, 1000);

   /* After setInterval update timeLeft value  or timer update new timer value '*/
    return this.setState({ timeLeft: timeLeft, timer: timer });
  }
  /*render cycle use createElement div className pass use css or other
  div value h2 element h2 value "Timer" main heading */
  render() {
    return React.createElement(
      'div',
      { className: 'row-fluid' },
      React.createElement(
        'h2',
        null,
        'Timer'
      ),
      /*create one more div className pass css/bootstrape use 3 button element 
      pass obj to props name or value  startimer (pass.component (setInterval or clearInterval)
      triger   */
      React.createElement(
        'div',
        { className: 'btn-group', role: 'group' },
        React.createElement(Button, { time: '10', startTimer: this.startTimer }),
        React.createElement(Button, { time: '20', startTimer: this.startTimer }),
        React.createElement(Button, { time: '30', startTimer: this.startTimer })
      ),
      /*createElement timer is a 1st Component top props name or value is 
      timeLeft new value to setState*/
      React.createElement(Timer, { timeLeft: this.state.timeLeft }),
      /*audio is element id pass or src audio file add time finish audio alert
      set if cond timer value is 0 alert sound*/
      React.createElement('audio', { id: 'end-of-time', src: 'flute_c_long_01.wav', preload: 'auto' })
    );
  }
}

/*TimerWrapper is main programing component display DOMrender document id path*/
ReactDOM.render(
    React.createElement(TimerWrapper, null),
     document.getElementById('timer'));
/*Thanks you very much Read My commited code best regard "Muhammad kareem"*/
