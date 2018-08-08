<?php
/**
 * Plugin Name: Questionnaire
 * Plugin URI: https://github.com/billthefarmer/quiz/
 * Description: Lets you create a questionnaire using your data.
 * Version: 0.5
 * Author: Bill Farmer
 * Author URI: https://github.com/billthefarmer/
 * License: MIT
 */

/*
 * Created by Bill Farmer
 * Licensed under the MIT.
 * Copyright (C) 2018 Bill Farmer
 */

// Add scripts hook, also adds shortcodes and further action
add_action('wp_enqueue_scripts', 'questionnaire_enqueue_scripts', 11);

// Queue scripts and styles. Wordpress includes jquery-ui script files,
// but not all the styles
function questionnaire_enqueue_scripts() {

    // Check on a page

    if (is_page()) {

        wp_enqueue_style('jquery-ui',
                         plugins_url('/css/jquery-ui.min.css', __FILE__));
        wp_enqueue_style('questionnaire',
                         plugins_url('/css/questionnaire.css', __FILE__));

        wp_enqueue_script('questionnaire',
                          plugins_url('/js/questionnaire.js', __FILE__),
                          array('jquery-ui-core', 'jquery-ui-widget',
                                'jquery-ui-mouse', 'jquery-ui-button',
                                'jquery-ui-progressbar', 'jquery-effects-core',
                                'jquery'));

        // Add the shortcodes and actions to insert the code into the
        // page
        add_shortcode('questionnaire-questions',
                      'questionnaire_questions_shortcode');
        add_shortcode('questionnaire-results',
                      'questionnaire_results_shortcode');
        add_action('wp_footer', 'questionnaire_footer', 11);
    }
}

// Add the content if the shortcode is found.
function questionnaire_questions_shortcode($atts) {

    // Buffer the output
    ob_start();

    ?>
<div class="questionnaire-intro">
  <fieldset>
    <h4 id="questionnaire-intro"></h4>
    <input type="button" id="questionnaire-start"
           class="questionnaire-button" value="Begin!" />
  </fieldset>
</div>
<div class="questionnaire-question">
  <fieldset>
    <div id="questionnaire-progress"></div>
    <h4 id="questionnaire-question"></h4>
    <input type="radio" id="questionnaire-radio-1" name="questionnaire-answer"
           class="questionnaire-answer" value="questionnaire-answer-1" />
    <label for="questionnaire-radio-1" class="questionnaire-label"
           id="questionnaire-label-1">
    </label><br />
    <input type="radio" id="questionnaire-radio-2" name="questionnaire-answer"
           class="questionnaire-answer" value="questionnaire-answer-2" />
    <label for="questionnaire-radio-2" class="questionnaire-label"
           id="questionnaire-label-2">
    </label><br /><br />
    <input type="button" id="questionnaire-back"
           class="questionnaire-button" value="Back" />
  </fieldset>
</div>
<div class="questionnaire-last">
  <fieldset>
    <div id="questionnaire-progress-max"></div>
    <h4 id="questionnaire-last"></h4>
    <input type="radio" id="questionnaire-radio-3" name="questionnaire-last"
           class="questionnaire-last" value="questionnaire-answer-3" />
    <label for="questionnaire-radio-3" class="questionnaire-label"
           id="questionnaire-label-3">
    </label><br />
    <input type="radio" id="questionnaire-radio-4" name="questionnaire-last"
           class="questionnaire-last" value="questionnaire-answer-4" />
    <label for="questionnaire-radio-4" class="questionnaire-label"
           id="questionnaire-label-4">
    </label><br />
    <input type="radio" id="questionnaire-radio-5" name="questionnaire-last"
           class="questionnaire-last" value="questionnaire-answer-5" />
    <label for="questionnaire-radio-5" class="questionnaire-label"
           id="questionnaire-label-5">
    </label><br />
    <input type="radio" id="questionnaire-radio-6" name="questionnaire-last"
           class="questionnaire-last" value="questionnaire-answer-6" />
    <label for="questionnaire-radio-6" class="questionnaire-label"
           id="questionnaire-label-6">
    <input type="radio" id="questionnaire-radio-7" name="questionnaire-last"
           class="questionnaire-last" value="questionnaire-answer-7" />
    <label for="questionnaire-radio-7" class="questionnaire-label"
           id="questionnaire-label-7">
    </label><br /><br />
    <input type="button" id="questionnaire-prev"
           class="questionnaire-button" value="Back" />
  </fieldset>
</div>
<div class="questionnaire-result">
  <form action="" method="get" class="questionnaire-result">
    <fieldset>
      <h3>Results</h3>
      <fieldset>
        <table>
          <tr><td><label for="questionnaire-arch">Archetype: </label></td>
            <td><input type="text" id="questionnaire-arch"
                       name="questionnaire-arch" readonly></td></tr>
          <tr><td><label for="questionnaire-brain">Brain: </label></td>
            <td><input type="text" id="questionnaire-brain"
                       name="questionnaire-brain" readonly></td></tr>
          <tr><td><label for="questionnaire-arch">Communication: </label></td>
            <td><input type="text" id="questionnaire-comm"
                       name="questionnaire-comm" readonly></td></tr>
          <tr><td><label for="questionnaire-arch">Direction: </label></td>
            <td><input type="text" id="questionnaire-direct"
                       name="questionnaire-direct" readonly></td></tr>
          <tr><td><label for="questionnaire-exec">Execution: </label></td>
            <td><input type="text" id="questionnaire-exec"
                       name="exec" readonly></td></tr>
          <tr><td><label for="arch">Focus: </label></td>
            <td><input type="text" id="focus"
                       name="focus" readonly></td></tr>
          <tr><td><label for="journey">Journey: </label></td>
            <td><input type="questionnaire-text" id="questionnaire-journey"
                       name="questionnaire-journey" readonly></td></tr>
        </table>
      </fieldset>
      <h3>Contact Information</h3>
      <fieldset>
        <table>
          <tr><td><label for="questionnaire-forename">First name: </label></td>
            <td><input type="text" id="questionnaire-forename"
                       name="questionnaire-forename" required></td></tr>
          <tr><td><label for="questionnaire-lastname">Last name: </label></td>
            <td><input type="text" id="questionnaire-lastname"
                       name="questionnaire-lastname" required></td></tr>
          <tr><td><label for="questionnaire-email">Email: </label></td>
            <td><input type="email" id="questionnaire-email"
                       name="questionnaire-email" required></td></tr>
        </table>
      </fieldset>
      <br />
      <input type="button" id="questionnaire-again"
             class="questionnaire-button" value="Again" />
      <input type="submit" id="questionnaire-submit"
             class="questionnaire-button" value="Results" />
    </fieldset>
  </form>
</div>
<?php

    // Return the output
    return ob_get_clean();
}

// Add the content if the shortcode is found.
function questionnaire_results_shortcode($atts) {

    // Buffer the output
    ob_start();

    // Return the output
    return ob_get_clean();
}

// Questionnaire footer
function questionnaire_footer() {

}
