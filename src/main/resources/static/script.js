let userPrincipal = null;
let usersList = null;
let rolesList = null;

let updateId = 0;
let updateName = null;
let updatePassword = null;
let updateRole = null;

$(document).ready(function () {

    // $('.nav-pills a[href="#v-pills-user"]').tab('show');
    // $('.nav-pills a[href="#v-pills-admin"]').tab('show');
    // $('.nav-tabs a[href="#users_table"]').tab('show');
    // $('.nav-tabs a[href="#add_user"]').tab('show');
    // $('#updateModal').modal('show');
    //
    // $('#v-pills-user').on('shown.bs.tab', function () {
    //
    // });
    //
    // $('#v-pills-admin').on('shown.bs.tab', function () {
    //
    // });
    //
    // $('#users_table').on('shown.bs.tab', function () {
    //
    // });
    //
    // $('#add_user').on('shown.bs.tab', function () {
    //
    // });

    $("#add_btn").click(function () {
        let addFormInput = $(this).closest("form");
        let addName = addFormInput.find("#add_name").val();
        let addPassword = addFormInput.find("#add_password").val();
        let addRole = addFormInput.find("#select_add_role").val();
        let data = {
            name: addName,
            password: addPassword,
            role: {
                role: addRole
            }
        };

        if (addName !== '' && addPassword !== '') {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/admin/add_user",
                data: JSON.stringify(data),
                success: function () {
                    console.log("ADD SUCCESS");
                    usersListLoad();
                    $('.nav-tabs a[href="#users_table"]').tab('show');
                },
                error: function (error) {
                    console.log("ADD ERROR : ", error);
                }

            });
        }

    });

    $("#modal_update_btn").click(function () {
        let modalUpdateFormInput = $(this).closest("form");
        let updateId = modalUpdateFormInput.find("#update_id").val();
        let updateName = modalUpdateFormInput.find("#update_name").val();
        let updatePassword = modalUpdateFormInput.find("#update_password").val();
        let updateRole = modalUpdateFormInput.find("#select_update_role").val();
        let data = {
            id: updateId,
            name: updateName,
            password: updatePassword,
            role: {
                role: updateRole
            }
        };

        if (updateName !== '') {
            $.ajax({
                type: "PUT",
                contentType: "application/json",
                url: "/admin/upd_user",
                data: JSON.stringify(data),
                success: function () {
                    console.log("UPDATE SUCCESS");
                    usersListLoad();
                    $('#updateModal').modal('hide');
                },
                error: function (error) {
                    console.log("UPDATE ERROR : ", error);
                }
            });
        }

    });

});

function firstLoad() {
    userPrincipalLoad();
}

function userPrincipalLoad() {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/current_user",
        dataType: 'json',
        success: function (data) {
            console.log("USER PRINCIPAL LOAD SUCCESS : ", data);
            userPrincipal = data;

            if (userPrincipal["role"]["role"] === "ROLE_ADMIN") {
                usersListLoad();
                rolesListLoad();
            }

            fillUserPrincipalTable();
        },
        error: function (error) {
            console.log("USER PRINCIPAL LOAD ERROR : ", error);
        }
    });

}

function usersListLoad() {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/admin/users",
        dataType: 'json',
        success: function (data) {
            console.log("USERS LIST LOAD SUCCESS : ", data);
            usersList = data;

            fillUsersTable();
        },
        error: function (error) {
            console.log("USERS LIST LOAD ERROR : ", error);
        }
    });

}

function rolesListLoad() {

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/admin/roles",
        dataType: 'json',
        success: function (data) {
            console.log("ROLES LIST LOAD SUCCESS : ", data);
            rolesList = data;

            fillRolesSelect();
        },
        error: function (error) {
            console.log("ROLES LIST LOAD ERROR : ", error);
        }

    })
}

function fillUserPrincipalTable() {
    $('#user_table_body').append("<tr>" +
        "<td>" + userPrincipal["id"] + "</td>" +
        "<td>" + userPrincipal["name"] + "</td>" +
        "<td>" + userPrincipal["role"]["role"] + "</td>" +
        "</tr>");
}

function fillUsersTable() {
    $('#users_table_body').empty();
    $.each(usersList, function (index, value) {
        $('#users_table_body').append("<tr>" +
            "<td id='users_table_row_id'>" + value["id"] + "</td>" +
            "<td id='users_table_row_name'>" + value["name"] + "</td>" +
            "<td id='users_table_row_role'>" + value["role"]["role"] + "</td>" +
            "<td>" + "<button id='update_btn' class='btn btn-primary' type='button'> update </button>" + "</td>" +
            "<td>" + "<button id='delete_btn' class='btn btn-primary' type='button'> delete </button>" + "</td>" +
            "</tr>");
    });

    $("tbody #delete_btn").click(function () {
        let usersTableRow = $(this).closest("tr");
        let deleteId = usersTableRow.find("#users_table_row_id").text();
        let data = {
            id: deleteId
        };

        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "/admin/del_user",
            data: JSON.stringify(data),
            success: function () {
                console.log("DELETE SUCCESS");

                usersListLoad();
            },
            error: function (error) {
                console.log("DELETE ERROR : ", error);
            }

        });

    });

    $("tbody #update_btn").click(function (e) {
        let usersTableRow = $(this).closest("tr");
        updateId = usersTableRow.find("#users_table_row_id").text();
        updateName = usersTableRow.find("#users_table_row_name").text();
        updatePassword = usersTableRow.find("#users_table_row_password").text();
        updateRole = usersTableRow.find("#users_table_row_role").text();
        $('#updateModal').modal('show');
    });

    $('#updateModal').on('show.bs.modal', function (e) {
        $('#update_id').val(updateId);
        $('#update_hidden_id').val(updateId);
        $('#update_name').val(updateName);
        $('#update_password').val(updatePassword);
        $('#select_update_role').val(updateRole);
    });
}

function fillRolesSelect() {
    $.each(rolesList, function (index, value) {
        $('#select_update_role').append("<option value=" + value["role"] + ">" + value["role"] + "</option>");
        $('#select_add_role').append("<option value=" + value["role"] + ">" + value["role"] + "</option>");
    });
}
