# Configuration de l'API de Recherche de Vol

Cette application supporte plusieurs APIs pour la recherche d'informations de vol. Vous pouvez choisir celle qui correspond le mieux à vos besoins.

## Options disponibles

### 1. **Amadeus API** (Recommandé - Plan gratuit)
- **Limite gratuite** : 2000 requêtes par mois
- **Avantages** : Plus de requêtes que AviationStack, API moderne et complète
- **Inscription** : [https://developers.amadeus.com/](https://developers.amadeus.com/)
- **Documentation** : [https://developers.amadeus.com/self-service](https://developers.amadeus.com/self-service)

### 2. **AviationStack API** (Plan gratuit limité)
- **Limite gratuite** : 100 requêtes par mois
- **Avantages** : Simple à configurer, pas besoin d'OAuth
- **Inscription** : [https://aviationstack.com/](https://aviationstack.com/)

### 3. **OpenSky Network** (Gratuit mais limité)
- **Limite gratuite** : 4000 requêtes par jour
- **Note** : Ne supporte pas la recherche directe par numéro de vol, nécessite une approche différente

## Configuration

### Option 1 : Utiliser Amadeus (Recommandé)

1. **Créer un compte Amadeus** :
   - Allez sur [https://developers.amadeus.com/](https://developers.amadeus.com/)
   - Cliquez sur "Get Started" et créez un compte gratuit
   - Créez une nouvelle application dans le Self-Service Portal
   - Notez votre `Client ID` et `Client Secret`

2. **Configurer dans l'application** :
   - Ouvrez `src/assets/config.json`
   - Définissez `"provider": "amadeus"` dans `api.flight`
   - Remplissez les champs `clientId` et `clientSecret` :
   ```json
   {
     "api": {
       "flight": {
         "provider": "amadeus",
         "amadeus": {
           "clientId": "VOTRE_CLIENT_ID",
           "clientSecret": "VOTRE_CLIENT_SECRET",
           "apiUrl": "https://test.api.amadeus.com"
         }
       }
     }
   }
   ```

3. **Note** : Pour la production, changez `apiUrl` en `"https://api.amadeus.com"`

### Option 2 : Utiliser AviationStack

1. **Créer un compte AviationStack** :
   - Allez sur [https://aviationstack.com/](https://aviationstack.com/)
   - Cliquez sur "Get Free API Key" et créez un compte
   - Copiez votre clé API depuis le dashboard

2. **Configurer dans l'application** :
   - Ouvrez `src/assets/config.json`
   - Définissez `"provider": "aviationstack"` dans `api.flight`
   - Remplissez le champ `apiKey` :
   ```json
   {
     "api": {
       "flight": {
         "provider": "aviationstack",
         "aviationStack": {
           "apiKey": "VOTRE_CLE_API",
           "apiUrl": "https://api.aviationstack.com/v1/flights"
         }
       }
     }
   }
   ```

## Changer de fournisseur

Pour changer de fournisseur d'API, modifiez simplement la valeur de `"provider"` dans `src/assets/config.json` :
- `"amadeus"` pour Amadeus
- `"aviationstack"` pour AviationStack
- `"opensky"` pour OpenSky (non recommandé pour la recherche par numéro de vol)

## Test

Une fois configuré, testez en :
1. Allant sur la page "Transfert Aéroport"
2. Entrant un numéro de vol (ex: "AF123", "LH456")
3. Vérifiant que les informations du vol s'affichent automatiquement

## Dépannage

- **Erreur "API credentials not configured"** : Vérifiez que vous avez bien rempli les champs dans `config.json`
- **Erreur "401 Unauthorized"** : Vérifiez que vos identifiants sont corrects
- **Erreur "429 Too Many Requests"** : Vous avez atteint la limite de votre plan gratuit
- **Aucune donnée retournée** : Vérifiez que le numéro de vol est au bon format (ex: "AF123" et non "Air France 123")
