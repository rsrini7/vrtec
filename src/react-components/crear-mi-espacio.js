import React, { Component } from "react";
import PropTypes from "prop-types";
import { generateHubName } from "../utils/name-generation";
import { getReticulumFetchUrl } from "../utils/phoenix-utils";

import DialogContainer from "./dialog-container.js";
import { WithHoverSound } from "./wrap-with-audio";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ReactSelect from 'react-select';


const HUB_NAME_PATTERN = "^[A-Za-z0-9-'\":!@#$%^&*(),.?~ ]{4,64}$";

export default class CreateRoomDialog extends Component {
  static propTypes = {
    includeScenePrompt: PropTypes.bool,
    onCustomScene: PropTypes.func,
    onClose: PropTypes.func
  };

  state = {
	name: generateHubName(),
	environmentIndex: null,
	selectedOption: null,
	customSceneUrl: ""
  };

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
		const value = selectedOption.value;

		// if (value == 1) {
		// 	const customSceneUrl = "http://hub.link/ok1rbg6";
		// 	this.setState({customSceneUrl});
		// }
		// if (value == 2) {
		// 	const customSceneUrl = "https://hubs.mozilla.com/scenes/pEGfEuQ/evrlobby";
		// 	this.setState({customSceneUrl});
		// }
		// if (value == 3) {
		// 	const customSceneUrl = "http://hub.link/ok1rbg4";
		// 	this.setState({customSceneUrl});
		// }
		// if (value == 4) {
		// 	const customSceneUrl = "http://hub.link/ok1rbg3";
		// 	this.setState({customSceneUrl});
		// }
	}
 
  handleSubmit = async e => {
		const environment = this.props.environments[this.state.selectedOption.value];

    const payload = {
      hub: { name: this.state.name }
	};
	
	if (!this.state.customSceneUrl && environment.scene_id) {
		payload.hub.scene_id = environment.scene_id;
	} else {
		const sceneUrl = this.state.customSceneUrl || environment.bundle_url;
		payload.hub.default_environment_gltf_bundle_url = sceneUrl;
	}

	const createUrl = getReticulumFetchUrl("/api/v1/hubs");

	const res = await fetch(createUrl, {
		body: JSON.stringify(payload),
		headers: { "content-type": "application/json" },
		method: "POST"
	});

	const hub = await res.json();

	if (!process.env.RETICULUM_SERVER || document.location.host === process.env.RETICULUM_SERVER) {
		document.location = hub.url;
	} else {
		document.location = `/hub.html?hub_id=${hub.hub_id}`;
	}

	return false;
  }

  render() {

		const { selectedOption } = this.state;
		const { onCustomScene, onClose, ...other } = this.props;
  
		const options = [{ label: 'Conferencias', value: 0 },
						{ label: 'Área común', value: 1 },
						{ label: 'GALTEC', value: 2 },
						{ label: 'Nuevo espacio', value: 3 }];

		return (
			<DialogContainer title="Selecciona una opción" onClose={onClose} {...other}>

				<form>
					<Select
					value={selectedOption}
					onChange={this.handleChange}
					className="menu-outer-top"
					options={options}
					placeholder="Elige uno"
					/>

					<div className="custom-scene-form">
						<div className="custom-scene-form__buttons">

							<button type="button" className="custom-scene-form__action-button" onClick={this.handleSubmit}>
								<span>Crear mi espacio</span>
							</button>
						</div>
					</div>

				</form>
			</DialogContainer>
		);
  }
}
