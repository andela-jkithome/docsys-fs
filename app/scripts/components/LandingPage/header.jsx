(function(){
  'use strict';
  var React = require('react'),

    Header = React.createClass({
      render: function() {
        return(
          <div id="landing">
          <header>
            <nav>
              <div className="nav-wrapper">
                <a href="#" className="brand-logo"><img className="logo-img" src="../../images/logo.gif" /></a>
                <a data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                  <li><a href="/login">Login</a></li>
                </ul>
                <ul className="side-nav" id="mobile-demo">
                  <li><a href="/login">Login</a></li>
                </ul>
              </div>
            </nav>
          </header>
          <main>
            <div className="container">
              <h1 className="shadow">The simplest way to manage your documents.</h1>
              <div className="center-btn">
                <button className="join btn waves-effect waves-light" type="submit" name="action"><a href= "/join" className = "join-btn">GET STARTED</a>
                </button>
              </div>
            </div>
          </main>
          </div>
          );
      }
  });
  module.exports = Header;
})();