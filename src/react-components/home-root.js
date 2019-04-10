import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from 'react-dom';
import { IntlProvider, FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";



import { lang, messages } from "../utils/i18n";

import hubLogo from "../assets/images/hub-preview-light-no-shadow.png";
import tecLogo from "../assets/images/logo_largo.png";
import vrtecLogo from "../assets/images/logo_vrtec.png";
import mozLogo from "../assets/images/moz-logo-white.png";
import mundo1 from "../assets/images/1.jpg";
import mundo2 from "../assets/images/2.jpg";
import mundo3 from "../assets/images/3.jpg";
import classNames from "classnames";
import { ENVIRONMENT_URLS } from "../assets/environments/environments";
import { connectToReticulum } from "../utils/phoenix-utils";

import styles from "../assets/stylesheets/index.scss";

import HubCreatePanel from "./hub-create-panel.js";
import AuthDialog from "./auth-dialog.js";
import ReportDialog from "./report-dialog.js";
import JoinUsDialog from "./join-us-dialog.js";
import UpdatesDialog from "./updates-dialog.js";
import CrearEspacio from "./crear-mi-espacio.js";
import DialogContainer from "./dialog-container.js";
import { WithHoverSound } from "./wrap-with-audio";


addLocaleData([...en]);

class HomeRoot extends Component {
  static propTypes = {
    intl: PropTypes.object,
    sceneId: PropTypes.string,
    authVerify: PropTypes.bool,
    authTopic: PropTypes.string,
    authToken: PropTypes.string,
    authOrigin: PropTypes.string,
    listSignup: PropTypes.bool,
    report: PropTypes.bool,
    initialEnvironment: PropTypes.string
  };

  state = {
    environments: [],
    dialog: null,
    mailingListEmail: "",
    mailingListPrivacy: false
  };

  componentDidMount() {
    this.closeDialog = this.closeDialog.bind(this);
    if (this.props.authVerify) {
      this.showAuthDialog(true);
      this.verifyAuth().then(this.showAuthDialog);
      return;
    }
    if (this.props.sceneId) {
      this.loadEnvironmentFromScene();
    } else {
      this.loadEnvironments();
    }
    
    if (this.props.listSignup) {
      this.showUpdatesDialog();
    } else if (this.props.report) {
      this.showReportDialog();
    }
  }

  async verifyAuth() {
    const socket = connectToReticulum();
    const channel = socket.channel(this.props.authTopic);
    await new Promise((resolve, reject) =>
      channel
        .join()
        .receive("ok", resolve)
        .receive("error", reject)
    );
    channel.push("auth_verified", { token: this.props.authToken });
  }

  showAuthDialog = verifying => {
    this.setState({ dialog: <AuthDialog verifying={verifying} authOrigin={this.props.authOrigin} /> });
  };

  

  closeDialog() {
    this.setState({ dialog: null });
  }

  showJoinUsDialog() {
    this.setState({ dialog: <JoinUsDialog onClose={this.closeDialog} /> });
  }
				  
CrearEspacio() {
    this.setState({ dialog: <CrearEspacio environments={this.state.environments} onClose={this.closeDialog} /> });
  }	  

  showReportDialog() {
    this.setState({ dialog: <ReportDialog onClose={this.closeDialog} /> });
  }

  showUpdatesDialog() {
    this.setState({
      dialog: <UpdatesDialog onClose={this.closeDialog} onSubmittedEmail={() => this.showEmailSubmittedDialog()} />
    });
  }

  showEmailSubmittedDialog() {
    this.setState({
      dialog: (
        <DialogContainer onClose={this.closeDialog}>
          Great! Please check your e-mail to confirm your subscription.
        </DialogContainer>
      )
    });
  }

  loadEnvironmentFromScene = async () => {
    let sceneUrlBase = "/api/v1/scenes";
    if (process.env.RETICULUM_SERVER) {
      sceneUrlBase = `https://${process.env.RETICULUM_SERVER}${sceneUrlBase}`;
    }
    const sceneInfoUrl = `${sceneUrlBase}/${this.props.sceneId}`;
    const resp = await fetch(sceneInfoUrl).then(r => r.json());
    const scene = resp.scenes[0];
    const attribution = scene.attribution && scene.attribution.split("\n").join(", ");
    const authors = attribution && [{ organization: { name: attribution } }];
    // Transform the scene info into a an environment bundle structure.
    this.setState({
      environments: [
        {
          scene_id: this.props.sceneId,
          meta: {
            title: scene.name,
            authors,
            images: [{ type: "preview-thumbnail", srcset: scene.screenshot_url }]
          }
        }
      ]
    });
  };

  loadEnvironments = () => {
    const environments = [];

    const environmentLoads = ENVIRONMENT_URLS.map(src =>
      (async () => {
        const res = await fetch(src);
        const data = await res.json();
        data.bundle_url = src;
        environments.push(data);
      })()
    );

    Promise.all(environmentLoads).then(() => {this.setState({ environments })});
  };

  onDialogLinkClicked = trigger => {
    return e => {
      e.preventDefault();
      e.stopPropagation();
      trigger();
    };
  };

	 
  render() {
    const mainContentClassNames = classNames({
      [styles.mainContent]: true,
      [styles.noninteractive]: !!this.state.dialog
    });
	  

	
    return (
      <IntlProvider locale={lang} messages={messages}>
        <div className={styles.home}>
          <div className={mainContentClassNames}>
            
            <div className={styles.header}>
				<div className={styles.headerContent}>
					<a href="">
						<img src={vrtecLogo}/>
					</a>
				</div>
			</div>
		
				
      
	<ul className={styles.grid}>
  		<li>
    		 <div className={classNames({[styles.item]: true, [styles.img1]: true})}>
					<div className={styles.info}>
						<h3>
						<a href="https://localhost:8080/hub.html?hub_id=AHEK73S">¡VAMOS!</a>
						</h3>
					</div>
				</div>
    		<div className={styles.name}>
      			<h4>
				<a href="https://localhost:8080/hub.html?hub_id=AHEK73S">CONFERENCIAS</a>
	  			</h4>
			</div>
  		</li>
		
		<li>
    		<div className={classNames({[styles.item]: true, [styles.img2]: true})}>
      			<div className={styles.info}>
        			<h3>
          			<a href="https://localhost:8080/hub.html?hub_id=25UdSPv">¡VAMOS!</a>
        			</h3>
      			</div>
    		</div>
    		<div className={styles.name}>
      			<h4>
				<a href="https://localhost:8080/hub.html?hub_id=25UdSPv">ÁREA COMÚN</a>
	  			</h4>
			</div>
  		</li>
		
		<li>
    		<div className={classNames({[styles.item]: true, [styles.img3]: true})}>
      			<div className={styles.info}>
        			<h3>
          			<a href="https://localhost:8080/hub.html?hub_id=oo9PyOA">¡VAMOS!</a>
        			</h3>
      			</div>
    		</div>
    		<div className={styles.name}>
      			<h4>
				<a href="https://localhost:8080/hub.html?hub_id=oo9PyOA">GALTEC</a>
	  			</h4>
			</div>
  		</li>
  
</ul>
		<div className={styles.btn1}>
	  				<a
                      className={styles.action}
                      rel="noopener noreferrer"
                      href="#"
                      onClick={this.onDialogLinkClicked(this.CrearEspacio.bind(this))}
                    >
                      <FormattedMessage id="home.action" />
                    </a>
				</div>
	  
            <div className={styles.footerContent}>
              <div className={styles.links}>
                <div className={styles.top}>
                    <a
                      className={styles.link}
                      rel="noopener noreferrer"
                      href="#"
                    >
                      <FormattedMessage id="home.terminos" />
                    </a>

                    <a
                      className={styles.link}
                      rel="noopener noreferrer"
                      href="#"
                    >
                      <FormattedMessage id="home.drtec" />
                    </a>

                    <a
                      className={styles.link}
                      rel="noopener noreferrer"
                      href="#"
                    >
                      <FormattedMessage id="home.privacidad" />
                    </a>

                  

                </div>
              </div>
            </div>
          </div>
        {this.state.dialog}
        </div>
      </IntlProvider>
    );
  }
}

export default HomeRoot;
