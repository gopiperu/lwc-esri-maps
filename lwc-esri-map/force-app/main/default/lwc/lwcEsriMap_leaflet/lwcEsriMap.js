import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import leaflet from '@salesforce/resourceUrl/leaflet';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';


export default class LwcEsriMap extends LightningElement {
    @track map

    leafletInitialized = false;
    renderedCallback() {
        if(this.leafletInitialized)
        {
            return;
        }
        this.leafletInitialized = true;
        console.log('rendered-callback');

        Promise.all([
            loadScript(this, leaflet + '/leaflet.js'),
            loadStyle(this, leaflet + '/leaflet.css')
            ])
            .then(() => {
                this.initializeLeafLet();
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading leaflet library',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }

    initializeLeafLet()
    {
        console.log('initialize leaflet');
        const mapEl = this.template.querySelector('.map-root')
        mapEl.style = 'height: ' + this.height + ';'
        this.map = L.map(mapEl, { zoomControl: false })
          .setView([ 32.955740, -96.824257 ], 14) // Default View
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          {
            attribution: 'Justin Lyon @ Slalom'
          }).addTo(this.map)
        //this.fireMapReady()
    }
}