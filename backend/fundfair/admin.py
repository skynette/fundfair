from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import Campaign, CustomUser, EmailVerification

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'email', 'wallet_address', 'email_verified')


class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('wallet_address', 'email_verified')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('wallet_address', 'email_verified')}),
    )


class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ('email', 'code', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('email', 'code')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at', 'email', 'code')

    fieldsets = (
        ('Email Verification Information', {
            'fields': ('email', 'code')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)  # This makes the section collapsible
        }),
    )
    
    list_per_page = 25
    ordering = ('-created_at',)

# Register your models here.
admin.site.register(Campaign)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(EmailVerification, EmailVerificationAdmin)
admin.site.site_header = "FundFair Admin"
admin.site.site_title = "FundFair Admin Portal"
admin.site.index_title = "Welcome to FundFair Admin Portal"
