# SRA Pilates & Fitness

Multi-page website for SRA Pilates & Fitness — studios in Chembur and Bandra.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Pilates classes | `pilates.html` |
| Gyrotonic classes | `gyrotonics.html` |
| Testimonials | `testimonials.html` |
| Events | `events.html` |

## Run locally

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## Structure

- `styles.css` — shared styles
- `js/nav.js` — shared navigation, footer, and active page highlighting
- `js/machines.js` — machine data and accordion behaviour
- `js/home.js` — home page interactions (hero, sphere diagram)
- `js/classes.js` — initialises the machine list on class pages

## Customising machine images

Edit the `MACHINES` object in `js/machines.js`.
