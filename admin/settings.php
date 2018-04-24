<?php
add_action('admin_menu', 'extra_settings_menu');

function extra_settings_menu() {
    add_menu_page('Extra Settings', 'Extra Settings', 'administrator', __FILE__, 'extra_settings_html');
    add_action('admin_init', 'register_mysettings');
}

function register_mysettings() {
    register_setting('extra_settings_group', 'call_us_text');
    register_setting('extra_settings_group', 'call_us_phone');
    register_setting('extra_settings_group', 'call_us_email');
}

function extra_settings_html() {
    ?><div class="wrap">
        <h2>Extra Settings</h2>
        <form method="post" action="options.php">
            <?php settings_fields('extra_settings_group'); ?>
            <style type="text/css">
            .form-table input {
                width: 100%;
            }
            </style>
            <table class="form-table">
                <tr valign="top">
                    <th>Call-us text message</th>
                    <td><input type="text" name="call_us_text" value="<?php echo get_option('call_us_text'); ?>"></td>
                </tr>
                <tr valign="top">
                    <th>Call-us phone (for {phone} placeholder)</th>
                    <td><input type="text" name="call_us_phone" value="<?php echo get_option('call_us_phone'); ?>"></td>
                </tr>
                <tr valign="top">
                    <th>Call-us email (for {email} placeholder)</th>
                    <td><input type="text" name="call_us_email" value="<?php echo get_option('call_us_email'); ?>"></td>
                </tr>
            </table>

            <p class="submit">
                <input type="submit" class="button-primary" value="Save Changes" />
            </p>
        </form>
    </div><?php
}