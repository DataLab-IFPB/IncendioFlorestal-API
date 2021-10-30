import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

const mapboxgl = require('mapbox-gl');

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  mapa: any;

  @Input() dados: object;

  ngOnInit(): void {
    this.configMap();
    this.configLayer();
  }

  private configMap(): void {
    mapboxgl.accessToken = environment.mapboxkey;

    this.mapa = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-37.3103333, -7.0219652],
      zoom: 10,
      minZoom: 7
    });

    this.mapa.dragRotate.disable();
    this.mapa.touchZoomRotate.disableRotation();
  }

  private configLayer(): void {
    this.mapa.on('load', () => {

      this.mapa.addSource('dataset-incendios-florestais', {
        'type': 'geojson',
        'data': this.dados
      }); // addSource

      this.mapa.addLayer({
        'id': 'incendios-florestais-heatmap',
        'type': 'heatmap',
        'source': 'dataset-incendios-florestais',
        'paint': {
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2, 1, 10
          ]
        }
      }); // addLayer

    });
  }

}
