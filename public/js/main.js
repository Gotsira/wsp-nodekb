$(document).ready(function() {
    $('.delete-athlete').on('click', function(e) {
        $target = $(e.target)
        const id = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/athletes/'+id,
            success: function(response) {
                alert('Deleting Athlete')
                window.location.href='/'
            },
            error: function(err) {
                console.log(err);
                
            }
        })
    })
})