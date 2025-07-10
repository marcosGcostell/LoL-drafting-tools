<!-- {%LONG_NAME%} -->
<div class="pool__lane">
  <div class="pool__lane__icon">
    <img src="{%LANE_ICONS%}{%IMG%}" alt="{%LONG_NAME%}" />
    <span>{%LONG_NAME%}</span>
  </div>
  <div id="{%ID%}__pool" class="profile__pool">
    <!-- Place to insert champions selected -->
  </div>
  <div class="profile__search">
    <div class="profile__champion input__clickable" id="{%ID%}__btn">
      <svg>
        <use href="{%ICONS%}#icon-plus-circle"></use>
      </svg>
      <span>Add</span>
    </div>
    <div class="popup__container">
      <div id="{%ID%}__selector" class="popup search__popup hidden">
        <div class="search">
          <input
            id="{%ID%}__search"
            type="text"
            class="input"
            placeholder="Champion..."
          />
          <span>
            <svg class="search__icon">
              <use href="{%ICONS%}#icon-search"></use>
            </svg>
          </span>
        </div>
        <ul id="{%ID%}__list" class="search__results">
          <!-- Place to insert search resutlts -->
        </ul>
      </div>
    </div>
  </div>
</div>