import $ from 'jquery';

import './styles/mock.scss'

import runPage from './scripts/mock/run-page'

$(document).ready(() => {
  runPage(window.pageName);
});
