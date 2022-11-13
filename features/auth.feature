# language: fr
Fonctionnalité: Authentification d'un utilisateur

  Pour pouvoir utiliser le site web,
  l'utilisateur doit s'enregistrer/s'identifier.

Scénario: Nouvel utilisateur

  Étant donné un nouvel utilisateur sur la page d'inscription
  Lorsque l'utilisateur entre ses informations correctement
  Alors un nouveau compte est créé
  Et l'utilisateur est connecté

Scénario: authentification acceptée

  Étant donné un nouvel utilisateur sur la page de connexion
  Lorsque l'utilisateur entre ses informations correctement
  Alors l'utilisateur est connecté

Scénario: authentification refusée

  Étant donné un nouvel utilisateur sur la page de connexion
  Lorsque l'utilisateur entre ses informations incorrectement
  Alors il est refusé
  Et il est redirigé sur la page de connexion
