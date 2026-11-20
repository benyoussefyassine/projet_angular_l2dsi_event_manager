import { computed, Injectable, signal } from '@angular/core';
import { Utilisateur } from '../modeles/utilisateur';

interface Compte extends Utilisateur {
  motDePasse: string;
}

const COMPTES: Compte[] = [
  { email: 'etudiant@iset.tn', motDePasse: 'etudiant123', nom: 'Ahmed Ben Salah', role: 'etudiant' },
  { email: 'club@iset.tn', motDePasse: 'club123', nom: 'Club Informatique', role: 'organisateur' },
];

@Injectable({ providedIn: 'root' })
export class Session {
  private readonly _utilisateur = signal<Utilisateur | null>(null);

  readonly utilisateur = this._utilisateur.asReadonly();
  readonly connecte = computed(() => this._utilisateur() !== null);
  readonly role = computed(() => this._utilisateur()?.role ?? null);
  readonly estOrganisateur = computed(() => this.role() === 'organisateur');

  connecter(email: string, motDePasse: string): boolean {
    const compte = COMPTES.find(c => c.email === email && c.motDePasse === motDePasse);
    if (!compte) return false;
    this._utilisateur.set({ email: compte.email, nom: compte.nom, role: compte.role });
    return true;
  }

  deconnecter(): void {
    this._utilisateur.set(null);
  }
}