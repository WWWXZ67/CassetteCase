<<<<<<< HEAD
# CassetteCaseCASCAS — обновление избранного

Затронутые файлы:
- src/screens/Main/EpisodeScr.js
- src/screens/Main/PlayerScr.js
- src/components/Button/4/ButtonFavorite.js

Новый SQL:
- supabase/favorites.sql

Порядок применения:
1. Сделайте резервную копию проекта.
2. Скопируйте три файла в соответствующие пути проекта с заменой.
3. В Supabase откройте SQL Editor и выполните supabase/favorites.sql.
4. Перезапустите Expo с очисткой кэша: npx expo start -c
5. Войдите в приложение, откройте выпуск, нажмите «Избранное».
6. Откройте PlayerScr того же выпуска: кнопка должна показывать то же состояние.
7. Откройте FavoritesScr и проверьте отображение и удаление.

Важно:
SQL создаёт episode_id с типом, автоматически скопированным из episodes.id.
Он рассчитан на случай, когда public.favorites ещё не существует. Если таблица
favorites уже есть, сначала покажите её структуру — не запускайте SQL вслепую.
=======
# CassetteCase
>>>>>>> e61b834622aae75f9ac3b194e911f3dcd3538257
