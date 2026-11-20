import { computed, inject, Injectable, signal } from '@angular/core';
import { Reservation } from '../modeles/reservation';
import { Evenements } from './evenements';
import { Session } from './session';

@Injectable({ providedIn: 'root' })
export class Reservations {
  private readonly evenements = inject(Evenements);
  private readonly session = inject(Session);

  private readonly _toutes = signal<Reservation[]>([]);

  readonly mesReservations = computed(() => {
    const utilisateur = this.session.utilisateur();
    if (!utilisateur) return [];
    return this._toutes().filter(r => r.email === utilisateur.email);
  });

  readonly nombre = computed(() => this.mesReservations().length);

  estDejaInscrit(evenementId: number): boolean {
    return this.mesReservations().some(r => r.evenementId === evenementId);
  }

  reserver(evenementId: number, nbPlaces: number, telephone: string): Reservation | null {
    const utilisateur = this.session.utilisateur();
    if (!utilisateur) return null;

    const reservation: Reservation = {
      id: Math.max(0, ...this._toutes().map(r => r.id)) + 1,
      evenementId,
      email: utilisateur.email,
      nbPlaces,
      telephone,
      dateReservation: new Date(),
    };
    this._toutes.update(liste => [...liste, reservation]);
    this.evenements.modifierPlaces(evenementId, nbPlaces);
    return reservation;
  }

  annuler(reservationId: number): void {
    const reservation = this._toutes().find(r => r.id === reservationId);
    if (!reservation) return;

    this._toutes.update(liste => liste.filter(r => r.id !== reservationId));
    this.evenements.modifierPlaces(reservation.evenementId, -reservation.nbPlaces);
  }
}