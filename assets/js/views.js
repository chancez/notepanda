var noteView = Backbone.View.extend({
  initialize: function() {
    this.parents = panda.notes.get_parents(this.options.model.get('parent_id'));
    this.children = panda.notes.with_parent(this.options.model.get('id'));
    
    window.v = this;

  },

  events: {
    'click .new_note': 'new_note',
    'click .category, .note': 'view_note'
  },

  attributes: {
    "class": "row"
  },

  render: function() {
    var type = this.options.model.get('type');
    this.$el.html(panda.templates[type].call(this, {
      model: this.options.model.attributes,
      children: this.children,
      parents: this.parents
    }));
    return this;
  },

  new_note: function() {
      var id = this.options.model.get('id');
      panda.router.navigate('#!/new_note/' + id, {trigger: true});
  },

  view_note: function(event) {
      var target_href = $(event.target).attr('data-href');
      if(target_href) {
        panda.router.navigate(target_href, {trigger: true});
      }
  }
});

var editNoteView = Backbone.View.extend({
  events: {
    'click .save': 'save'
  },

  render: function() {
    if(this.options.model) {
      this.$el.html(panda.templates.edit_note({
        name: this.options.model.get('name'),
        content: this.options.model.get('content')
      }));
    } else {
      this.$el.html(panda.templates.edit_note({
        name: '',
        content: ''
      }));
    }
    this.$el.find('textarea').wysihtml5();
    return this;
  },

  save: function(event) {
    event.preventDefault();
    var name = this.$el.find('input').val();
    var content = this.$el.find('textarea').val();
    var id = '';

    if(name.length === 0) {
      return;
    }

    if(this.options.model) {
      this.options.model.set({
        name: name,
        content: content,
        type: content ? 'note' : 'category'
      });
      id = this.options.model.get('id');
    } else {
      panda.notes.add({
        name: name,
        content: content,
        type: content ? 'note' : 'category',
        parent_id: this.options.pid
      });
      var model = _.last(panda.notes.models);
      id = model.get('id');
    }
    panda.notes.sync_notes();
    panda.router.navigate('#!/notes/' + id, {trigger: true});
  }
});
