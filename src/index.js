import './css/styles.css';
import Notiflix from 'notiflix';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const inputSearchBox = document.querySelector('#search-box');

function renderCountryList(countries) {
  const markup = countries
    .map(countries => {
      return `
          <li class="country-list-item">
            <img src="${countries.flags.svg}" alt="${countries.name.official} flag"/>
            <p>${countries.name.official}</p>
          </li>`;
    }).join('');

  countryList.innerHTML = '';
  countryList.innerHTML = markup;
}
function renderCountryItems(countries) {
  const markup = countries
    .map(countries => {
      return `
      <div class="box">
        <img src="${countries.flags.svg}" alt="${countries.name.official} flag"/>
        <h2>${countries.name.official}</h2>
      </div>
      <p><b>Capital</b>: ${countries.capital}</p>
      <p><b>Population</b>: ${countries.population}</p>
      <p><b>Languages</b>: ${Object.values(countries.languages)}</p>     
      `;
    }).join('');

  countryList.innerHTML = '';
  countryInfo.insertAdjacentHTML('beforeend', markup);
}

const inputF = (e) => {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name');
        } else if (countries.length > 1 && countries.length <= 10) {
          renderCountryList(countries);
        } else if (countries.length === 1) {
          renderCountryItems(countries);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
  if (inputValue === '') {
    Notiflix.Notify.warning('Please enter a country name');
  }
};

inputSearchBox.addEventListener('input', debounce(inputF, DEBOUNCE_DELAY));