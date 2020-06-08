"use strict";

import {resetToDefault} from  './picture-effects.js'

import * as backend from  './backend.js'
import {renderPictureElements} from './pictures.js';
import './form-validation.js'



backend.ajaxGetRequest(renderPictureElements);
