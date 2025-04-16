<!DOCTYPE html>
<html lang="en" style="background-color: transparent; width: 100%; height: 100%">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Growtopia Player Support</title>
    <link rel="icon" type="image/png" href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/images/growtopia.ico" sizes="16x16" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link media="all" rel="stylesheet" href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/css/faq-main.css" />
    <link media="all" rel="stylesheet" href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/css/shop-custom.css" />
    <link media="all" rel="stylesheet" href="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/css/ingame-custom.css" />
    <style>
        .modal-backdrop {
            background-color: rgba(0, 0, 0, 0.1);
        }
        .modal-backdrop + div {
            overflow: auto;
        }
        .modal-body, .content {
            padding: 0;
        }
        .password-input-group {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            background: none;
            border: none;
            color: #666;
        }
        .error-message {
            color: #dc3545;
            margin-top: 5px;
            font-size: 0.9em;
            display: none;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body style="background-color: transparent">
    <button type="button" class="btn btn-primary hidden" data-toggle="modal" id="modalButton" data-target="#modalShow" data-backdrop="static" data-keyboard="false"></button>
    
    <div class="content">
        <section class="common-box">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 col-sm-12">
                        <div class="modal fade product-list-popup" id="modalShow" tabindex="-1" role="dialog" aria-hidden="false">
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div class="content">
                                            <section class="common-box">
                                                <div class="container">
                                                    <div class="section-title center-align">
                                                        <h2>Log Into Your GTPSID</h2>
                                                    </div>
                                                    <div class="row div-content-center">
                                                        <div class="col-md-12 col-sm-12">
                                                            <form id="loginForm" method="POST" action="/player/growid/login/validate" accept-charset="UTF-8" class="needs-validation" novalidate>
                                                                <input name="_token" type="hidden" value="<%= csrfToken %>" />
                                                                
                                                                <div class="form-group">
                                                                    <input id="loginGrowId" class="form-control grow-text" placeholder="Your GrowID Name *" name="growId" type="text" required minlength="4" />
                                                                    <div class="error-message" id="nameError">GrowID must be at least 4 characters</div>
                                                                </div>
                                                                
                                                                <div class="form-group password-input-group">
                                                                    <input id="loginPassword" class="form-control grow-text" placeholder="Your GrowID Password *" name="password" type="password" required minlength="4" />
                                                                    <button type="button" class="password-toggle" id="toggleLogPassword">
                                                                        <i class="fas fa-eye"></i>
                                                                    </button>
                                                                    <div class="error-message" id="passwordError">Password must be at least 4 characters</div>
                                                                </div>
                                                                
                                                                <div class="form-group text-center">
                                                                    <button type="submit" class="btn btn-lg btn-primary grow-button" id="loginButton">Login</button>
                                                                </div>
                                                            </form>
                                                            
                                                            <div class="text-center mt-3">
                                                                <a href="/player/register" class="btn btn-link">Don't have any gtpsid? Register here!</a>
                                                            </div>
                                                            
                                                            <div id="errorDiv" class="alert alert-danger hidden mt-3">
                                                                <span id="errorMessage"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <script src="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/vendors/jquery/jquery-2.1.4.min.js"></script>
    <script src="https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/vendors/bootstrap/javascripts/bootstrap.min.js"></script>
    
    <script>
        // Prevent multiple clicks
        let clicked = false;
        $('a').click(function() {
            if (clicked === false) {
                clicked = true;
                return true;
            }
            return false;
        });

        // DevTools prevention
        document.onkeydown = function(e) {
            if (e.key == 'F12' || e.keyCode == 123 || 
                (e.ctrlKey && e.shiftKey && (e.key == 'I' || e.key == 'C' || e.key == 'J')) {
                e.preventDefault();
                return false;
            }
        };

        // Form validation and submission
        $(document).ready(function() {
            // Show modal on load
            $('#modalButton').trigger('click');
            
            // Close modal handler
            $('.close').on('click', function() {
                window.location = '/player/validate/close';
            });
            
            // Password toggle
            $('#toggleLogPassword').click(function() {
                const passwordField = $('#loginPassword');
                const icon = $(this).find('i');
                
                if (passwordField.attr('type') === 'password') {
                    passwordField.attr('type', 'text');
                    icon.removeClass('fa-eye').addClass('fa-eye-slash');
                } else {
                    passwordField.attr('type', 'password');
                    icon.removeClass('fa-eye-slash').addClass('fa-eye');
                }
            });
            
            // Form validation
            $('#loginForm').submit(function(e) {
                e.preventDefault();
                
                const growId = $('#loginGrowId').val().trim();
                const password = $('#loginPassword').val().trim();
                let isValid = true;
                
                // Reset errors
                $('.error-message').hide();
                $('#errorDiv').addClass('hidden');
                
                // Validate GrowID
                if (growId.length < 4) {
                    $('#nameError').show();
                    isValid = false;
                }
                
                // Validate Password
                if (password.length < 4) {
                    $('#passwordError').show();
                    isValid = false;
                }
                
                if (isValid) {
                    // Store GrowID in localStorage if needed
                    if (localStorage) {
                        localStorage.setItem('growId', growId);
                    }
                    
                    // Submit the form
                    this.submit();
                } else {
                    $('#errorMessage').text('Please fill all fields correctly');
                    $('#errorDiv').removeClass('hidden');
                }
            });
            
            // Load saved GrowID if available
            if (localStorage && localStorage.getItem('growId')) {
                $('#loginGrowId').val(localStorage.getItem('growId'));
            }
            
            // Responsive scaling for mobile
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        if (mutation.addedNodes[i].tagName == 'DIV') {
                            var thediv = mutation.addedNodes[i];
                            var sw = window.screen.width;
                            if (sw < 667) {
                                $(thediv).css({
                                    transform: 'scale(0.75)',
                                    'transform-origin': '0 0',
                                    '-webkit-transform': 'scale(0.75)',
                                    '-webkit-transform-origin': '0 0',
                                    overflow: 'auto',
                                });
                            }
                        }
                    }
                });
            });
            observer.observe(document.body, {
                attributes: false,
                childList: true,
                characterData: false
            });
        });
    </script>
</body>
</html>
