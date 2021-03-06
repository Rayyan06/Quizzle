# Generated by Django 3.0.2 on 2020-12-14 15:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20201214_1523'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='answers',
        ),
        migrations.RemoveField(
            model_name='quiz',
            name='questions',
        ),
        migrations.AddField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='api.Question'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='api.Quiz'),
            preserve_default=False,
        ),
    ]
