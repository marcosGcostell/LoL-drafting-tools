<div class="champion" id="c{%INDEX%}">
  <div class="champion__top">
    <img src="{%IMG_SRC%}{%IMG%}" alt="{%NAME%}" class="champion__img" />
    <div class="champion__bookmark">
      <img
        class="champion__icon selector__clickable"
        src="assets/img/icons/star.png"
        alt="bookmark"
      />
    </div>
    <div class="champion__close">
      <img
        class="champion__icon selector__clickable"
        src="assets/img/icons/close.png"
        alt="close"
      />
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
