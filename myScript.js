/**
 * Created by KARLO on 20.11.2016..
 */
var app = angular.module("myApp", ["ngRoute"]);

function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        // [START createprovider]
        var provider = new firebase.auth.FacebookAuthProvider();
        // [END createprovider]
        // [START addscopes]
        provider.addScope('user_birthday');
        // [END addscopes]
        // [START signin]
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // [START_EXCLUDE]
            document.getElementById('quickstart-oauthtoken').textContent = token;
            // [END_EXCLUDE]
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // [START_EXCLUDE]
            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
                // If you are using multiple auth providers on your app you should handle linking
                // the user's accounts here.
            } else {
                console.error(error);
            }
            // [END_EXCLUDE]
        });
        // [END signin]
    } else {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    }
    // [START_EXCLUDE]
    document.getElementById('quickstart-sign-in').disabled = true;
    // [END_EXCLUDE]
}
// [END buttoncallback]
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    var hasUser = false;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in-status').textContent = 'Signed in as: ';
            document.getElementById('quickstart-sign-in').textContent = 'Log out';
            document.getElementById('quickstart-account-details').textContent = displayName;
            var newProfileImgElement = document.createElement("img");
            newProfileImgElement.setAttribute("src", photoURL);
            document.getElementById('quickstart-account-details').appendChild(newProfileImgElement);
            hasUser = true;
            // [END_EXCLUDE]
        } else {
            // User is signed out.
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in').textContent = 'Log in with Facebook';
            if (hasUser)
            {
                document.getElementById('quickstart-sign-in-status').textContent = "";
                document.getElementById('quickstart-account-details').textContent = "";
                hasUser = false;
            }
            // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
    });
    // [END authstatelistener]
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
}
window.onload = function() {
    initApp();
};

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
