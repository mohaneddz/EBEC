'use server';

import { createAdminClient } from './client';

export async function switchDepartment(userId: string, newDepartment: string) {
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { department: newDepartment },
    });

    if (error) {
        console.error('Error switching department:', error.message);
        return { success: false, error: 'Could not switch department.' };
    }

    return { success: true, data };
}

export async function deleteDepartmentSwitch(userId: string) {
    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin.from('department_switch').delete().eq('user_id', userId);

    if (error) {
        console.error('Error deleting department switch:', error.message);
        return { success: false, error: 'Could not delete department switch.' };
    }

    return { success: true };
}

export async function changeUserDepartment(userId: string, newDepartment: string) {
    const supabaseAdmin = await createAdminClient();

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { department: newDepartment },
    });

    if (error) {
        console.error('Error changing user department:', error.message);
        return { success: false, error: 'Could not change user department.' };
    }

    return { success: true, data };
}
