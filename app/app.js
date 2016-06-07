var $ = require('jquery');
var Vue = require('vue');
var _ = require('underscore');

if ($("#calculator").length) {
  var calculator = new Vue({
    el: "#calculator",

    data: {
      favor: null,
      goal: null,
      goals: [
        {id: 0, name: "Sparks"},
        {id: 1, name: "Spark Failures"},
        {id: 2, name: "Consecutive Sparks"},
        {id: 3, name: "Consecutive Spark Failures"},
        {id: 4, name: "Accumulated Favor"},
        {id: 5, name: "Max Favor"},
        {id: 6, name: "Talk Freely"}
      ],
      goalParam: "0",
      interest: null,
      loading: false,
      notFound: null,
      selected: 0,
      result: null,
      target: null,
      targets: []
    },

    computed: {
      validFavor: function() {
        return this.target.combinations[this.interest].data;
      },

      validInterests: function() {
        return _.keys(this.target.combinations);
      }
    },

    created: function() {
      this.fetchTargets();
    },

    methods: {
      baseURL: function() {
        return document.location.protocol + "//localhost:3000";
      },

      clearTarget: function() {
        this.favor = null;
        this.goal = null;
        this.goalParam = "0";
        this.interest = null;
        this.notFound = null;
        this.result = null;

        $("#favor_picker option").prop("selected", false);
        $("#goal_picker option").prop("selected", false);
        $("#interest_picker option").prop("selected", false);
      },
      
      downvote: function() {
        var self = this;

        $.get(this.baseURL() + "/results/" + this.result.id + "/down", function(data) {
          self.result.voted = true;
          self.result.downvotes += 1;
        });
      },

      fetchTarget: function() {
        var xhr = new XMLHttpRequest();
        var self = this;

        this.clearTarget();
        this.loading = true;

        xhr.open("GET", this.baseURL() + "/targets/" + this.selected);
        xhr.onload = function() {
          self.target = JSON.parse(xhr.responseText);
          self.loading = false;
        };

        xhr.send();
      },

      fetchTargets: function() {
        var xhr = new XMLHttpRequest();
        var self = this;

        this.loading = true;

        xhr.open("GET", this.baseURL() + "/targets");
        xhr.onload = function() {
          self.targets = JSON.parse(xhr.responseText);
          self.loading = false;
        };

        xhr.send();
      },

      knowledgeFor: function(k) {
        var result = $.grep(this.target.knowledges, function(e) { return e.id == k; });
        return result[0];
      },

      submit: function() {
        var xhr = new XMLHttpRequest();
        var self = this;

        if (this.goal == "6") {
          this.goalParam = "0";
        }

        this.loading = true;

        xhr.open("GET", this.baseURL() + "/query?t=" + encodeURIComponent(this.target.id) + "&f=" + encodeURIComponent(this.favor) + "&i=" + encodeURIComponent(this.interest) + "&g=" + this.goal + "&gp=" + encodeURIComponent(this.goalParam));
        xhr.onload = function() {
          var data = JSON.parse(xhr.responseText);

          if (data.status && data.status === "404") {
            self.result = null;
            self.notFound = true
          } else {
            self.notFound = null;

            self.result = data;
          }

          self.loading = false;
        };

        xhr.send();
      },

      upvote: function() {
        var self = this;

        $.get(this.baseURL() + "/results/" + this.result.id + "/up", function(data) {
          self.result.voted = true;
          self.result.upvotes += 1;
        });
      }
    },

    watch: {
      selected: "fetchTarget"
    }
  });
};

$(document).ready(function() {
  $("#calculator form").on("submit", function(e) {
    e.preventDefault();
    calculator.submit();
  });
});
