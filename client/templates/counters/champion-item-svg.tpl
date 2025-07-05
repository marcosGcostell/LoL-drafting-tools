<div class="champion" id="c{%INDEX%}">
  <div class="champion__top">
    <img src="{%IMG_SRC%}{%IMG%}" alt="{%NAME%}" class="champion__img" />
    <div class="champion__bookmark" id="c{%INDEX%}_bookmark">
      <svg class="champion__icon selector__clickable">
        <use href="{%ICONS%}#icon-bookmark"></use>
      </svg>
    </div>
    <div class="champion__close" id="c{%INDEX%}_close">
      <svg class="champion__icon selector__clickable">
        <use href="{%ICONS%}#icon-minus-circle"></use>
      </svg>
    </div>
  </div>
  <div class="champion__data">
    <span>WR: <span class="champion__wr">{%WR%}</span></span>
    <div class="champion__lane">
      <img src="assets/img/lanes/{%LANE%}.webp" alt="{%LANE%}" />
      <span>{%LANE_RATE%}%</span>
    </div>
  </div>
</div>
