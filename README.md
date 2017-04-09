# Установка
Для того, чтобы собрать стиль нужен [Node.js][node] и [NPM][npm].

Далее нужно установить все модули, необходимые для сборки.
```bash
npm i -S
```
Теперь можно запускать сборку через `npm run build`.

# Разработка
Для разработки нужен [Sass][sass].

```bash
sass --sourcemap=none --watch source.sass:out.css
```
[npm]: https://www.npmjs.com/get-npm
[sass]: http://sass-lang.com/install
[node]: http://nodejs.org/

## TODO
- Подумать над табами
- Удалить ненужные классы
- Поправить чекбоксы на "интересных публикациях"
- Сделать дев-билдер на ноде