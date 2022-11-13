# language: fr
  Fonctionnalité: Enregistrement d'un accident

    Pour pouvoir lister les accidents,
    il faut que les utilisateurs puissent les rapporter.

  Scénario: Comment rapporter un accident

    Étant donné le champ de description et d'adresse remplis
    Lorsque l'utilisateur voudra valider
    Alors l'accident sera listé sur le site.

  Scénario: Comment mal rapporter un accident

    Étant donné le champ de description ou d'adresse vide
    Lorsque l'utilisateur voudra valider
    Alors il ne lui sera pas permis de rapporté l'accident.
