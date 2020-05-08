const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

$(document).ready(() => {
  const $form = $('#form');
  const $button = $form.find('button[type="submit"]');
  const $password = $('#password');
  const $passwordMessageMinLength = $('#password-message-min-length');
  const $passwordMessageMaxLength = $('#password-message-max-length');
  const $passwordRepeat = $('#password-repeat');
  const $passwordRepeatMessage = $('#password-repeat-message');
  const $error = $('#error');
  const $success = $('#success');
  const token = $('#token').val();

  $form.submit(() => {
    const password = $password.val();
    $password.removeClass('is-danger');
    $passwordRepeat.removeClass('is-danger');
    $passwordMessageMinLength.addClass('is-hidden');
    $passwordMessageMaxLength.addClass('is-hidden');
    $passwordRepeatMessage.addClass('is-hidden');
    $error.addClass('is-hidden');

    if (password.length < PASSWORD_MIN_LENGTH) {
      $password.addClass('is-danger');
      $passwordMessageMinLength.removeClass('is-hidden');
    } else if (password.length > PASSWORD_MAX_LENGTH) {
      $password.addClass('is-danger');
      $passwordMessageMaxLength.removeClass('is-hidden');
    } else if (password !== $passwordRepeat.val()) {
      $passwordRepeat.addClass('is-danger');
      $passwordRepeatMessage.removeClass('is-hidden');
    } else {
      $password.attr('disabled', 'disabled');
      $passwordRepeat.attr('disabled', 'disabled');
      $button.addClass('is-loading');

      $.ajax({
        url: '/api/v1/auth/user/password_reset',
        type: 'POST',
        data: JSON.stringify({
          token,
          password,
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: () => {
          $form.find('.field').not($success).addClass('is-hidden');
          $success.removeClass('is-hidden');
        },
        error: () => {
          $error.removeClass('is-hidden');
        },
        complete: () => {
          $password.removeAttr('disabled');
          $passwordRepeat.removeAttr('disabled');
          $button.removeClass('is-loading');
        },
      });
    }
  });
});
