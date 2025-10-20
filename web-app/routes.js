const routes = {
  '/': {
    template: 'index.html',
    styles: ['styles/style.css'] // Массив стилей
  },
  '/rating': {
    template: 'rating.html',
    styles: ['styles/style.css', 'styles/rating.css']
  },
  '/race': {
    template: 'race.html',
    styles: ['styles/style.css', 'styles/race.css']
  },
  '/past_games': {
    template: 'past_games.html',
    styles: ['styles/style.css', 'styles/past_games.css']
  },
  '/menu': {
    template: 'menu.html',
    styles: ['styles/style.css', 'styles/menu.css']
  },
  '/tea': {
    template: 'tea.html',
    styles: ['styles/style.css', 'styles/tea.css']
  },
  '/parkour': {
    template: 'parkour.html',
    styles: ['styles/style.css', 'styles/parkour.css']
  },
  '/bar_map': {
    template: 'bar_map.html',
    styles: ['styles/style.css', 'styles/bar_map.css']
  }
};

export default routes;
