# Git-standarder

## Commit-meldinger
Alle commit-meldinger skal starte med én av følgende prefiks:

- **add:** - Ny funksjonalitet  
- **fix:** - Feilrettinger  
- **doc:** - Dokumentasjonsendringer  

**Eksempler:**

add: shopping cart persistence feature 

fix: price calculation in cart total

doc: update readme with new api endpoints


## Branching og PR-prosess
- Nye features og fixes gjøres på egen branch  
- Merge til `main` gjennom Pull Request  
- Krever minst én code review før merge  
- Små dokumentasjonsendringer kan committes direkte til `main` (bruk sunn fornuft)