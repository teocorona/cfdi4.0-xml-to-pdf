This is a small NodeJs project that generates a PDF invoice from a CFDI 4.0 xml file (mexican tax invoice format)

## Getting Started

Install dependencies:

```bash
npm install
```
Run app:

```bash
node app.js
```
Enter the invoice number


## Notes

- The `xml file` needs to be saved in `xml folder` and should be named as its invoice number.

- You can replace `logo.png` with your own logo.

- Update `styles.css` and `js/template.js` for a new design.

- The pdf invoice will be created in pdf folder.

- `db.json` keeps the last invoice number created.


