/**
 * Created by KARLO on 20.11.2016..
 */
var app = angular.module("myApp", ["ngRoute"]);

var provider = new firebase.auth.FacebookAuthProvider();
provider.setCustomParameters({
    'display': 'popup'
});

provider.addScope('user_birthday');

firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});


// Step 1.
// User tries to sign in to Facebook.
auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).catch(function(error) {
    // An error happened.
    if (error.code === 'auth/account-exists-with-different-credential') {
        // Step 2.
        // User's email already exists.
        // The pending Facebook credential.
        var pendingCred = error.credential;
        // The provider account's email address.
        var email = error.email;
        // Get registered providers for this email.
        auth.fetchProvidersForEmail(email).then(function(providers) {
            // Step 3.
            // If the user has several providers,
            // the first provider in the list will be the "recommended" provider to use.
            if (providers[0] === 'password') {
                // Asks the user his password.
                // In real scenario, you should handle this asynchronously.
                var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
                auth.signInWithEmailAndPassword(email, password).then(function(user) {
                    // Step 4a.
                    return user.link(pendingCred);
                }).then(function() {
                    // Facebook account successfully linked to the existing Firebase user.
                    goToApp();
                });
                return;
            }
            // All the other cases are external providers.
            // Construct provider object for that provider.
            // TODO: implement getProviderForProviderId.
            var provider = getProviderForProviderId(providers[0]);
            // At this point, you should let the user know that he already has an account
            // but with a different provider, and let him validate the fact he wants to
            // sign in with this provider.
            // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
            // so in real scenario you should ask the user to click on a "continue" button
            // that will trigger the signInWithPopup.
            auth.signInWithPopup(provider).then(function(result) {
                // Remember that the user may have signed in with an account that has a different email
                // address than the first one. This can happen as Firebase doesn't control the provider's
                // sign in flow and the user is free to login using whichever account he owns.
                // Step 4b.
                // Link to Facebook credential.
                // As we have access to the pending credential, we can directly call the link method.
                result.user.link(pendingCred).then(function() {
                    // Facebook account successfully linked to the existing Firebase user.
                    goToApp();
                });
            });
        });
    }
});

FB.Event.subscribe('auth.authResponseChange', checkLoginState);

function checkLoginState(event) {
    if (event.authResponse) {
        // User is signed-in Facebook.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!isUserEqual(event.authResponse, firebaseUser)) {
                // Build Firebase credential with the Facebook auth token.
                var credential = firebase.auth.FacebookAuthProvider.credential(
                    event.authResponse.accessToken);
                // Sign in with the credential from the Facebook user.
                firebase.auth().signInWithCredential(credential).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // ...
                });
            } else {
                // User is already signed-in Firebase with the correct user.
            }
        });
    } else {
        // User is signed-out of Facebook.
        firebase.auth().signOut();
    }
}

function isUserEqual(facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === facebookAuthResponse.userID) {
                // We don't need to re-auth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

firebase.auth().signOut().then(function() {
    // Sign-out successful.
}, function(error) {
    // An error happened.
});


app.controller("MainController", ["$scope", function ($scope)
{
    $scope.jobsList = [];
    $scope.jobsDoneList = [];
    var brojac = 0;
    var found = false;
    $scope.addJob = function ()
    {
        $scope.jobInputed2 = angular.uppercase($scope.jobInputed);
        if (!$scope.jobInputed2)
        {
            alert("You can't add empty item!");
            return;
        }
        if (brojac == 0)
        {
            $scope.jobsList = [{jobTodo: $scope.jobInputed2, jobDone: false}];
        }
        else
        {
            for (var i = 0; i < $scope.jobsList.length; i++)
            {
                if ($scope.jobsList[i].jobTodo == $scope.jobInputed2)
                {
                    found = true;
                    break;
                }
                else found = false;
            }
        }
        if (brojac > 0 && !found) {
            $scope.jobsList.push({jobTodo: $scope.jobInputed2, jobDone: false});
        }
        else if (brojac > 0 && found) alert("You are adding item that is already in the list!");
        brojac++;
        $scope.jobInputed = "";
    };/**   end function $scope.addJob  **/
    
    $scope.JobsDone = function ()
    {
        var helpList = $scope.jobsList;
        $scope.jobsList = [];
        angular.forEach(helpList, function (x)
        {
            if (!x.jobDone) $scope.jobsList.push(x);
            else $scope.jobsDoneList.push(x);
        });
    }; /**       end function $scope.JobsDone   **/

    var counter = 1;
    var button = document.getElementById("ShowHideButton");
    var changeTheValueAttribute = function ()
    {
        if (counter % 2 == 1) button.setAttribute("value", "Show unfinished jobs");
        else button.setAttribute("value", "Show finished jobs");
        counter++;
    };

    var title = document.getElementById("h3title");
    var changeTheTitle = function ()
    {
        if (counter % 2 == 1) title.innerText = "Unfinished jobs: ";
        else title.innerText = "Jobs finished: ";
    };

    if (button != null)
    {
        button.addEventListener("click", changeTheValueAttribute, false);
        button.addEventListener("click", changeTheTitle, false);
    }
}]);
