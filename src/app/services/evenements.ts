import { Injectable, signal } from '@angular/core';
import { Evenement } from '../modeles/evenement';
import { EVENEMENTS_INITIAUX } from '../donnees/evenements';

export type NouvelEvenement = Omit<Evenement, 'id' | 'placesReservees'>;

@Injectable({ providedIn: 'root' })
export class Evenements {
  private readonly _liste = signal<Evenement[]>(EVENEMENTS_INITIAUX);
  readonly liste = this._liste.asReadonly();

  parId(id: number): Evenement | undefined {
    return this._liste().find(e => e.id === id);
  }

  ajouter(donnees: NouvelEvenement): Evenement {
    const nouveau: Evenement = {
      ...donnees,
      id: Math.max(0, ...this._liste().map(e => e.id)) + 1,
      placesReservees: 0,
    };
    this._liste.update(liste => [...liste, nouveau]);
    return nouveau;
  }

  modifierPlaces(id: number, delta: number): void {
    this._liste.update(liste =>
      liste.map(e => (e.id === id ? { ...e, placesReservees: e.placesReservees + delta } : e))
    );
  }
}